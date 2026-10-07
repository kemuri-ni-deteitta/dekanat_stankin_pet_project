import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { Student } from "../../types/people.ts";

interface StudentState {
    students: Student[];
    selectedStudent: Student | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: StudentState = {
    students: [],
    selectedStudent: null,
    status: 'idle',
    error: null,
};

// === Async Thunks ===

export const fetchStudents = createAsyncThunk<Student[]>(
    'students/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/students/getAll');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchStudentById = createAsyncThunk<Student, number>(
    'students/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/students/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createStudent = createAsyncThunk<Student, Omit<Student, 'id'>>(
    'students/create',
    async (newStudent, { rejectWithValue }) => {
        try {
            const response = await api.post('/students/create', newStudent);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateStudent = createAsyncThunk<Student, Student>(
    'students/update',
    async (student, { rejectWithValue }) => {
        try {
            const response = await api.put(`/students/${student.id}`, student);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteStudent = createAsyncThunk<number, number>(
    'students/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/students/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// === Slice ===

const studentSlice = createSlice({
    name: 'students',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudents.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.students = action.payload;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchStudentById.pending, (state) => {
                state.status = 'loading';
                state.selectedStudent = null;
                state.error = null;
            })
            .addCase(fetchStudentById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedStudent = action.payload;
            })
            .addCase(fetchStudentById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        builder
            .addCase(createStudent.fulfilled, (state, action) => {
                state.students.push(action.payload);
            });

        builder
            .addCase(updateStudent.fulfilled, (state, action) => {
                const index = state.students.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.students[index] = action.payload;
                }
            });

        builder
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.students = state.students.filter(s => s.id !== action.payload);
            });
    }
});

export default studentSlice.reducer;
