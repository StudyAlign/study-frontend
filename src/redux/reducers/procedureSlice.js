import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    checkSurveyResultsApi, currentProcedureStepApi,
    endProcedureApi,
    getProcedureApi,
    nextProcedureApi,
    startProcedureApi
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";

const initialState = {
    procedure: null,
    currentProcedureStep: null,
    api: IDLE,
    error: null,
    status: null,
    currentRequestId: undefined
};

export const getProcedure = createAsyncThunk(
    'procedure',
    async (procedureId, { getState, rejectWithValue, requestId }) => {
        const { api, currentRequestId } = getState().procedure

        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }

        try {
            const response = await getProcedureApi(procedureId)
            console.log(response);
            return response
        } catch (err) {
            console.log(err)
            return rejectWithValue(err)
        }
    }
)

export const startProcedure = createAsyncThunk(
    'startProcedure',
    async (arg, { getState, rejectWithValue, requestId }) => {
        const { api, currentRequestId } = getState().procedure

        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }

        try {
            const response = await startProcedureApi()
            console.log(response);
            return response
        } catch (err) {
            console.log(err)
            return rejectWithValue(err)
        }
    }
)

export const nextProcedure = createAsyncThunk(
    'nextProcedure',
    async (arg, { getState, rejectWithValue, requestId }) => {
        const { api, currentRequestId } = getState().procedure

        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }

        try {
            const response = await nextProcedureApi()
            console.log(response);
            return response
        } catch (err) {
            console.log(err)
            return rejectWithValue(err)
        }
    }
)

export const endProcedure = createAsyncThunk(
    'endProcedure',
    async (arg, { getState, rejectWithValue, requestId }) => {
        const { api, currentRequestId } = getState().procedure

        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }

        try {
            const response = await endProcedureApi()
            console.log(response);
            return response
        } catch (err) {
            console.log(err)
            return rejectWithValue(err)
        }
    }
)

export const currentProcedure = createAsyncThunk(
    'currentProcedureStep',
    async (arg, { getState, rejectWithValue, requestId }) => {
        const { api, currentRequestId } = getState().procedure

        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }

        try {
            const response = await currentProcedureStepApi()
            console.log(response);
            return response
        } catch (err) {
            console.log(err)
            return rejectWithValue(err)
        }
    }
)

export const checkSurveyResults = createAsyncThunk(
    'checkSurveyResults',
    async (arg, { getState, rejectWithValue, requestId }) => {
        const { api, currentRequestId } = getState().procedure

        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }

        try {
            const response = await checkSurveyResultsApi()
            console.log(response);
            return response
        } catch (err) {
            console.log(err)
            return rejectWithValue(err)
        }
    }
)

// reducers
export const procedureSlice = createSlice({
    name: 'procedure',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProcedure.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getProcedure.fulfilled, (state, action) => {
                const { requestId } = action.meta
                console.log(action);
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.procedure = action.payload.body
                    state.status = action.payload.status;
                    state.currentRequestId = undefined
                }
            })
            .addCase(getProcedure.rejected, (state, action) => {
                const { requestId } = action.meta
                console.log("rejected")
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE;
                    state.error = action.payload;
                    state.status = action.payload.status;
                    state.currentRequestId = undefined;
                }
            })
            .addCase(startProcedure.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(startProcedure.fulfilled, (state, action) => {
                const { requestId } = action.meta
                console.log(action);
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.currentProcedureStep = action.payload.body
                    state.status = action.payload.status;
                    state.currentRequestId = undefined
                }
            })
            .addCase(startProcedure.rejected, (state, action) => {
                const { requestId } = action.meta
                console.log("rejected")
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE;
                    state.error = action.payload;
                    state.status = action.payload.status;
                    state.currentRequestId = undefined;
                }
            })
            .addCase(nextProcedure.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(nextProcedure.fulfilled, (state, action) => {
                const { requestId } = action.meta
                console.log(action);
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.currentProcedureStep = action.payload.body
                    state.status = action.payload.status;
                    state.currentRequestId = undefined
                }
            })
            .addCase(nextProcedure.rejected, (state, action) => {
                const { requestId } = action.meta
                console.log("rejected")
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE;
                    state.error = action.payload;
                    state.status = action.payload.status;
                    state.currentRequestId = undefined;
                }
            })
            .addCase(endProcedure.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(endProcedure.fulfilled, (state, action) => {
                const { requestId } = action.meta
                console.log(action);
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.currentProcedureStep = action.payload.body
                    state.status = action.payload.status;
                    state.currentRequestId = undefined
                }
            })
            .addCase(endProcedure.rejected, (state, action) => {
                const { requestId } = action.meta
                console.log("rejected")
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE;
                    state.error = action.payload;
                    state.status = action.payload.status;
                    state.currentRequestId = undefined;
                }
            })
            .addCase(currentProcedure.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(currentProcedure.fulfilled, (state, action) => {
                const { requestId } = action.meta
                console.log(action);
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.currentProcedureStep = action.payload.body
                    state.status = action.payload.status;
                    state.currentRequestId = undefined
                }
            })
            .addCase(currentProcedure.rejected, (state, action) => {
                const { requestId } = action.meta
                console.log("rejected")
                console.log(action)
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE;
                    state.error = action.payload;
                    state.status = action.payload.status;
                    state.currentRequestId = undefined;
                }
            })
            .addCase(checkSurveyResults.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(checkSurveyResults.fulfilled, (state, action) => {
                const { requestId } = action.meta
                console.log(action);
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status;
                    state.currentRequestId = undefined
                }
            })
            .addCase(checkSurveyResults.rejected, (state, action) => {
                const { requestId } = action.meta
                console.log("rejected")
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE;
                    state.error = action.payload;
                    state.status = action.payload.status;
                    state.currentRequestId = undefined;
                }
            })
    }
})

// selectors
export const selectProcedure = (state) => {
    return state.procedure.procedure
}

export const selectProcedureStatus = (state) => {
    return state.procedure.status;
}

export const selectProcedureError = (state) => {
    return state.procedure.error;
}

export const selectProcedureApi = (state) => {
    return state.study.api;
}

export const selectCurrentProcedureStep = (state) => {
    return state.procedure.currentProcedureStep
}


export default procedureSlice.reducer;