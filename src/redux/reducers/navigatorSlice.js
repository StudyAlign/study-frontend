import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    closeNavigatorApi, getNavigatorApi,
    getStudyApi,
    initApi,
    readTokensApi,
    reconnectNavigatorApi,
    startNavigatorApi
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";

const initialState = {
    navigator: null,
    api: IDLE,
    error: null,
    status: null,
    currentRequestId: undefined
};

export const startNavigator = createAsyncThunk(
    'navigator',
    async (arg, { getState, rejectWithValue, requestId }) => {
        const { api, currentRequestId } = getState().navigator

        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }

        try {
            const response = await startNavigatorApi()
            return response
        } catch (err) {
            console.log(err)
            return rejectWithValue(err)
        }
    }
)

export const reconnectNavigator = createAsyncThunk(
    'reconnectNavigator',
    async (arg, { getState, rejectWithValue, requestId }) => {
        const { api, currentRequestId } = getState().navigator

        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }

        try {
            const response = await reconnectNavigatorApi()
            console.log(response);
            return response
        } catch (err) {
            console.log(err)
            return rejectWithValue(err)
        }
    }
)

// reducers
export const navigatorSlice = createSlice({
    name: 'navigator',
    initialState,
    reducers: {
        get(state, action) {
            state.navigator = getNavigatorApi();
        },
        closeNavigator(state, action) {
            closeNavigatorApi();
        },
        setNavigatorStatus(state, action) {
            console.log("SET NAVI TO " + action.payload)
            state.status = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(startNavigator.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(startNavigator.fulfilled, (state, action) => {
                const { requestId } = action.meta
                console.log(action);
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload;
                    state.currentRequestId = undefined
                }
            })
            .addCase(startNavigator.rejected, (state, action) => {
                const { requestId } = action.meta
                console.log("rejected")
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE;
                    //state.error = action.payload;
                    state.status = true;
                    state.currentRequestId = undefined;
                }
            })
            .addCase(reconnectNavigator.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(reconnectNavigator.fulfilled, (state, action) => {
                const { requestId } = action.meta
                console.log(action);
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = true;
                    state.currentRequestId = undefined
                }
            })
            .addCase(reconnectNavigator.rejected, (state, action) => {
                const { requestId } = action.meta
                console.log("rejected")
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE;
                    //state.error = action.payload;
                    //state.status = action.payload.status;
                    state.currentRequestId = undefined;
                }
            })
    }
})

// selectors
export const selectNavigator = (state) => {
    return state.navigator.navigator
}

export const selectNavigatorStatus = (state) => {
    return state.navigator.status;
}

export const selectNavigatorError = (state) => {
    return state.navigator.error;
}

export const selectNavigatorApi = (state) => {
    return state.navigator.api;
}


export default navigatorSlice.reducer;