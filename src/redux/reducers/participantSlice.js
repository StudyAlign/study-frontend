import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    deleteTokensApi,
    getStudyApi,
    meApi,
    getParticipantApi,
    participateApi,
    readTokensApi,
    refreshTokenApi,
    storeTokensApi, updateAccessTokenApi, logProlificData, logProlificDataApi, storeLoggerKeyApi
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";

const initialState = {
    participant: null,
    availableParticipant: null,
    tokens: null,
    api: IDLE,
    error: null,
    status: null,
    currentRequestId: undefined
};

export const getParticipant = createAsyncThunk(
    'getParticipant',
    async (token, { getState, rejectWithValue, requestId }) => {
        const { api, currentRequestId } = getState().participant

        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }

        try {
            const response = await getParticipantApi(token);
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const participate = createAsyncThunk(
    'participate',
    async (token, { getState, rejectWithValue, requestId }) => {
        const { api, currentRequestId } = getState().participant
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }

        try {
            const response = await participateApi(token);
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const logProlificParams = createAsyncThunk(
    'logProlificParams',
    async (prolific, { getState, rejectWithValue, requestId }) => {
        const { api, currentRequestId } = getState().participant
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }

        try {
            const response = await logProlificDataApi(prolific);
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const me = createAsyncThunk(
    'me',
    async (arg, { getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().participant
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await meApi()
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const refreshToken = createAsyncThunk(
    'refreshToken',
    async (arg, { getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().participant
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await refreshTokenApi()
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

// reducers
export const participantSlice = createSlice({
    name: 'participant',
    initialState,
    reducers: {
        readTokens(state, action) {
            console.log("read tokens")
            state.tokens = readTokensApi()
        },
        deleteTokens(state, action) {
            console.log("delete tokens")
            deleteTokensApi()
            state.tokens = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getParticipant.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getParticipant.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.availableParticipant = action.payload.body
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                }
            })
            .addCase(participate.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(participate.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    const tokens = action.payload.body
                    state.tokens = tokens
                    console.log("save tokens to storage")
                    console.log(action.payload)
                    storeTokensApi(tokens) //save tokens to localstorage
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                }
            })
            .addCase(participate.rejected, (state, action) => {
                state.status = IDLE
                state.error = action.payload
            })
            .addCase(logProlificParams.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(logProlificParams.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    console.log("PROLIFIC PARAMS LOG")
                    console.log(action)
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                }
            })
            .addCase(logProlificParams.rejected, (state, action) => {
                state.status = IDLE
                state.error = action.payload
            })
            .addCase(refreshToken.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    const response = action.payload.body
                    updateAccessTokenApi(response) //save tokens to localstorage
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                }
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.status = IDLE
                state.error = action.payload
                console.log(action)
            })
            .addCase(me.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(me.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.participant = action.payload.body
                    const loggerKey = action.payload.body.logger_key
                    storeLoggerKeyApi(loggerKey)
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                }
            })
            .addCase(me.rejected, (state, action) => {
                state.status = IDLE
                state.error = action.payload
                console.log(action)
            })
        ;
    },
});

// selector
export const selectParticipantTokens = (state) => {
    return state.participant.tokens;
}

export const selectParticipant = (state) => {
    return state.participant.participant;
}

export const selectAvailableParticipant = (state) => {
    return state.participant.availableParticipant;
}

export const selectParticipantApi = (state) => {
    return state.participant.api;
}

export default participantSlice.reducer;