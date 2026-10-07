// features/kafedras/kafedraSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { Kafedra } from "../../types/kafedra.ts";

interface KafedraState {
    kafedras: Kafedra[];
    selectedKafedra: Kafedra | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: KafedraState = {
    kafedras: [],
    selectedKafedra: null,
    status: 'idle',
    error: null,
};

// === Async Thunks ===

export const fetchKafedras = createAsyncThunk<Kafedra[]>(
    'kafedras/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/kafedras/getAll");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchKafedraById = createAsyncThunk<Kafedra, number>(
    'kafedras/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/kafedras/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createKafedra = createAsyncThunk<Kafedra, Omit<Kafedra, 'id'>>(
    'kafedras/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('/kafedras/create', data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateKafedra = createAsyncThunk<Kafedra, Kafedra>(
    'kafedras/update',
    async (kafedra, { rejectWithValue }) => {
        try {
            const response = await api.put(`/kafedras/${kafedra.id}`, kafedra);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteKafedra = createAsyncThunk<number, number>(
    'kafedras/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/kafedras/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// === Slice ===

const kafedraSlice = createSlice({
    name: 'kafedras',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchKafedras.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchKafedras.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.kafedras = action.payload;
            })
            .addCase(fetchKafedras.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchKafedraById.pending, (state) => {
                state.status = 'loading';
                state.selectedKafedra = null;
                state.error = null;
            })
            .addCase(fetchKafedraById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedKafedra = action.payload;
            })
            .addCase(fetchKafedraById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        builder
            .addCase(createKafedra.fulfilled, (state, action) => {
                state.kafedras.push(action.payload);
            });

        builder
            .addCase(updateKafedra.fulfilled, (state, action) => {
                const index = state.kafedras.findIndex(i => i.id === action.payload.id);
                if (index !== -1) {
                    state.kafedras[index] = action.payload;
                }
            });

        builder
            .addCase(deleteKafedra.fulfilled, (state, action) => {
                state.kafedras = state.kafedras.filter(i => i.id !== action.payload);
            });
    }
});

export default kafedraSlice.reducer;
