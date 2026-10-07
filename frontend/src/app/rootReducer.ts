import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import adminReducer from '../features/admin/adminSlice';
import studentReducer from '../features/students/studentSlice';
import instituteReducer from '../features/institutes/instituteSlice';
import kafedraReducer from '../features/kafedras/kafedraSlice';
import employeesReducer  from '../features/employees/employeeSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    admin: adminReducer,
    students: studentReducer,
    institutes: instituteReducer,
    kafedras: kafedraReducer,
    employees:  employeesReducer
});

export default rootReducer;
