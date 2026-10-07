// features/institutes/instituteSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import {Institute} from "../../types/institute.ts";

interface InstituteState {
    institutes: Institute[];
    selectedInstitute: Institute | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: InstituteState = {
    institutes: [],
    selectedInstitute: null,
    status: 'idle',
    error: null,
};

// === Async Thunks ===

export const fetchInstitutes = createAsyncThunk<Institute[]>(
    'institutes/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/institutes/getAll");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchInstituteById = createAsyncThunk<Institute, number>(
    'institutes/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/institutes/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createInstitute = createAsyncThunk<Institute, Omit<Institute, 'id'>>(
    'institutes/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('/institutes/create', data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateInstitute = createAsyncThunk<Institute, Institute>(
    'institutes/update',
    async (institute, { rejectWithValue }) => {
        try {
            const response = await api.put(`/institutes/${institute.id}`, institute);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteInstitute = createAsyncThunk<number, number>(
    'institutes/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/institutes/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// === Slice ===

const instituteSlice = createSlice({
    name: 'institutes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInstitutes.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchInstitutes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.institutes = action.payload;
            })
            .addCase(fetchInstitutes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchInstituteById.pending, (state) => {
                state.status = 'loading';
                state.selectedInstitute = null;
                state.error = null;
            })
            .addCase(fetchInstituteById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedInstitute = action.payload;
            })
            .addCase(fetchInstituteById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        builder
            .addCase(createInstitute.fulfilled, (state, action) => {
                state.institutes.push(action.payload);
            });

        builder
            .addCase(updateInstitute.fulfilled, (state, action) => {
                const index = state.institutes.findIndex(i => i.id === action.payload.id);
                if (index !== -1) {
                    state.institutes[index] = action.payload;
                }
            });

        builder
            .addCase(deleteInstitute.fulfilled, (state, action) => {
                state.institutes = state.institutes.filter(i => i.id !== action.payload);
            });
    }
});

export default instituteSlice.reducer;
