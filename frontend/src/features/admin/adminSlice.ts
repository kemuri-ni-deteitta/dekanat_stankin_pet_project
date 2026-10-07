import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { IUser } from '../../types/user';

interface AdminState {
    roles: string[];
    users: IUser[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AdminState = {
    roles: [],
    users: [],
    status: 'idle',
    error: null,
};

// Получение всех ролей
export const getRoles = createAsyncThunk<string[], void, { rejectValue: string }>(
    'admin/getRoles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('auth/roles', { withCredentials: true });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получение всех пользователей
export const getUsers = createAsyncThunk<IUser[], void, { rejectValue: string }>(
    'admin/getUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('auth/users', { withCredentials: true });
            const users: IUser[] = response.data.map((user: { email: string; roles: string[] }) => ({
                email: user.email,
                roles: user.roles || [],
            }));
            return users;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Добавление роли
export const addRole = createAsyncThunk<void, { email: string; role: string }, { rejectValue: string }>(
    'admin/addRole',
    async ({ email, role }, { dispatch, rejectWithValue }) => {
        try {
            await api.post('auth/add_role', { email, role }, { withCredentials: true });
            await dispatch(getUsers());
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Удаление роли
export const removeRole = createAsyncThunk<void, { email: string; role: string }, { rejectValue: string }>(
    'admin/removeRole',
    async ({ email, role }, { dispatch, rejectWithValue }) => {
        try {
            await api.post('auth/remove_role', { email, role }, { withCredentials: true });
            await dispatch(getUsers());
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRoles.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getRoles.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.status = 'succeeded';
                state.roles = action.payload;
            })
            .addCase(getRoles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Ошибка загрузки ролей';
            });

        builder
            .addCase(getUsers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action: PayloadAction<IUser[]>) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Ошибка загрузки пользователей';
            });

        builder
            .addCase(addRole.rejected, (state, action) => {
                state.error = action.payload ?? 'Ошибка при добавлении роли';
            });

        builder
            .addCase(removeRole.rejected, (state, action) => {
                state.error = action.payload ?? 'Ошибка при удалении роли';
            });
    },
});

export default adminSlice.reducer;
