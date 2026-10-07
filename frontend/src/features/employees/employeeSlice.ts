import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from "../../api/axios";
import { Employee } from '../../types/employee';

interface State {
    employees: Employee[];
    selected?: Employee | null;
    status: 'idle' | 'loading' | 'failed';
    error?: string | null;
}

const initialState: State = { employees: [], status: 'idle', error: null };

/* ─── thunks ─── */
export const fetchEmployees = createAsyncThunk(
    'employees/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get<Employee[]>('employees/getAll');
            return data;
        } catch (e: any) {
            return rejectWithValue(e.response?.data?.message ?? e.message);
        }
    }
);

export const fetchEmployeeById = createAsyncThunk(
    'employees/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            const { data } = await api.get<Employee>(`employees/${id}`);
            return data;
        } catch (e: any) {
            return rejectWithValue(e.response?.data?.message ?? e.message);
        }
    }
);

export const createEmployee = createAsyncThunk(
    'employees/create',
    async (payload: Omit<Employee, 'id'>, { rejectWithValue }) => {
        try {
            const { data } = await api.post<Employee>('employees/create', payload);
            return data;
        } catch (e: any) {
            return rejectWithValue(e.response?.data?.message ?? e.message);
        }
    }
);

export const updateEmployee = createAsyncThunk(
    'employees/update',
    async (emp: Employee, { rejectWithValue }) => {
        try {
            const { data } = await api.put<Employee>(`employees/${emp.id}`, emp);
            return data;
        } catch (e: any) {
            return rejectWithValue(e.response?.data?.message ?? e.message);
        }
    }
);

export const deleteEmployee = createAsyncThunk(
    'employees/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`employees/${id}`);
            return id;
        } catch (e: any) {
            return rejectWithValue(e.response?.data?.message ?? e.message);
        }
    }
);

/* ─── slice ─── */
const employees = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        clearSelected: (s) => { s.selected = null; },
    },
    extraReducers: (b) => {
        b
            /* list */
            .addCase(fetchEmployees.pending, (s) => { s.status = 'loading'; })
            .addCase(fetchEmployees.fulfilled, (s, a) => {
                s.status = 'idle';
                s.employees = a.payload;
            })
            .addCase(fetchEmployees.rejected, (s, a) => {
                s.status = 'failed'; s.error = a.payload as string;
            })

            /* by id */
            .addCase(fetchEmployeeById.fulfilled, (s, a) => {
                s.selected = a.payload;
            })

            /* create */
            .addCase(createEmployee.fulfilled, (s, a) => {
                s.employees.push(a.payload);
            })

            /* update */
            .addCase(updateEmployee.fulfilled, (s, a) => {
                s.employees = s.employees.map((e) =>
                    e.id === a.payload.id ? a.payload : e
                );
            })

            /* delete */
            .addCase(deleteEmployee.fulfilled, (s, a) => {
                s.employees = s.employees.filter((e) => e.id !== a.payload);
            });
    },
});

export const { clearSelected } = employees.actions;
export default employees.reducer;
