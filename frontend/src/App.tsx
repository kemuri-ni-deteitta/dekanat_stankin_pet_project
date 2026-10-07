/* -----------------------------------------------------------------------
   App.tsx  –  основной роутер приложения (с учётом InstituteListPage)
   -------------------------------------------------------------------- */
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { CssBaseline } from '@mui/material';

import MainLayout      from './layouts/MainLayout';
import AuthLayout      from './layouts/AuthLayout';
import ProtectedRoute  from './components/ProtectedRoute';

/* ——— students ——— */
import StudentTable    from './features/students/components/StudentTable';
import StudentFormPage from './features/students/pages/StudentFormPage';

/* ——— institutes ——— */
import InstituteListPage  from './features/institutes/pages/InstituteListPage';   // <- вернули
import InstituteAdminPage from './features/institutes/pages/InstituteAdminPage';
import InstituteFormPage  from './features/institutes/pages/InstituteFormPage';

/* ——— kafedras ——— */
import KafedraTable    from './features/kafedras/components/KafedraTable';
import KafedraFormPage from './features/kafedras/pages/KafedraFormPage';

/* ——— employees ——— */
import EmployeeTable    from './features/employees/components/EmployeeTable';
import EmployeeFormPage from './features/employees/pages/EmployeeFormPage';

/* ——— лениво подгружаемые страницы ——— */
const AuthPage  = lazy(() => import('./features/auth/pages/AuthPage'));
const AdminPage = lazy(() => import('./features/admin/pages/AdminPage'));

function App() {
    return (
        <Suspense fallback={<div>Загрузка…</div>}>
            <CssBaseline />

            <Routes>
                {/* ---------- Public / Авторизация ---------- */}
                <Route element={<AuthLayout />}>
                    <Route path="auth" element={<AuthPage />} />
                </Route>

                {/* ---------- Основная часть приложения ---------- */}
                <Route path="/" element={<MainLayout />}>

                    {/* --- админ-панель --- */}
                    <Route
                        path="admin"
                        element={
                            <ProtectedRoute>
                                <AdminPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* --- институты --- */}
                    <Route path="institutes">
                        {/* витринный список */}
                        <Route index element={<InstituteListPage />} />
                        {/* таблица-панель для администратора */}
                        <Route
                            path="panel"
                            element={
                                <ProtectedRoute>
                                    <InstituteAdminPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="create"
                            element={
                                <ProtectedRoute>
                                    <InstituteFormPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route path=":id" element={<InstituteFormPage />} />
                    </Route>

                    {/* --- студенты --- */}
                    <Route path="students">
                        <Route
                            index
                            element={
                                <ProtectedRoute>
                                    <StudentTable />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="create"
                            element={
                                <ProtectedRoute>
                                    <StudentFormPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path=":id"
                            element={
                                <ProtectedRoute>
                                    <StudentFormPage />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    {/* --- кафедры --- */}
                    <Route path="kafedras">
                        <Route
                            index
                            element={
                                <ProtectedRoute>
                                    <KafedraTable />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="create"
                            element={
                                <ProtectedRoute>
                                    <KafedraFormPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route path=":id" element={<KafedraFormPage />} />
                    </Route>

                    {/* --- сотрудники --- */}
                    <Route path="employees">
                        <Route
                            index
                            element={
                                <ProtectedRoute>
                                    <EmployeeTable />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="new"
                            element={
                                <ProtectedRoute>
                                    <EmployeeFormPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path=":id"
                            element={
                                <ProtectedRoute>
                                    <EmployeeFormPage />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                </Route>
                {/* ---------- /MainLayout ---------- */}
            </Routes>
        </Suspense>
    );
}

export default App;
