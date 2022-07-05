import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {getStudyApi, initApi, readTokensApi} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";

const initialState = {
    study: null,
    api: IDLE,
    error: null,
    status: null,
    currentRequestId: undefined
};

export const getStudy = createAsyncThunk(
    'study',
    async (studyId, { getState, rejectWithValue, requestId }) => {
        const { api, currentRequestId } = getState().study
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }

        try {
            const response = await getStudyApi(studyId)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

// reducers
export const studySlice = createSlice({
    name: 'study',
    initialState,
    reducers: {
        initApi(state, action) {
            initApi(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStudy.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getStudy.fulfilled, (state, action) => {
                const { requestId } = action.meta
                console.log(action);
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.study = action.payload.body
                    state.status = action.payload.status;
                    state.currentRequestId = undefined

                    console.log(state.study)
                }
            })
            .addCase(getStudy.rejected, (state, action) => {
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
export const selectStudy = (state) => {
    return state.study.study
}

export const selectStudyStatus = (state) => {
    return state.study.status;
}

export const selectStudyError = (state) => {
    return state.study.error;
}

export const selectStudyApi = (state) => {
    return state.study.api;
}


export default studySlice.reducer;