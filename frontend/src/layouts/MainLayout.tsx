import { Outlet } from "react-router-dom";
import { Box, Container, useTheme } from "@mui/material";
import Sidebar from "../components/common/Sidebar.tsx";

const MainLayout = () => {
    const theme = useTheme();

    const items = [
        { label: 'Главная', href: '/', roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
        {
            label: 'Студенты',
            roles: ['ADMIN', 'TEACHER'],
            subItems: [
                { label: 'Список студентов', href: '/students', roles: ['ADMIN'] },
            ],
        },
        {
            label: 'Сотрудники',
            roles: ['ADMIN'],
            subItems: [
                { label: 'Список сотрудников', href: '/employees', roles: ['ADMIN'] },
                // { label: 'Добавить сотрудника',           href: '/employees/new', roles: ['ADMIN'] }
            ]
        },
        // {
        //     label: 'Преподаватели',
        //     roles: ['ADMIN'],
        //     subItems: [
        //         { label: 'Список преподавателей', href: '/teachers', roles: ['ADMIN'] },
        //     ],
        // },
        {
            label: 'Институты',
            roles: ['ADMIN'],
            subItems: [
                { label: 'Информация', href: '/institutes', roles: ['ADMIN'] },
                { label: 'Список', href: '/institutes/panel', roles: ['ADMIN'] },
            ],
        },
        {
            label: 'Кафедры',
            roles: ['ADMIN', 'EMPLOYEE'],
            subItems: [
                { label: 'Список кафедр', href: '/kafedras', roles: ['ADMIN', 'EMPLOYEE'] },
            ],
        },
        // {
        //     label: 'Учебный процесс',
        //     roles: ['STUDENT', 'TEACHER'],
        //     subItems: [
        //         { label: 'Расписание', href: '/schedule' },
        //         { label: 'Успеваемость', href: '/grades', roles: ['STUDENT'] },
        //     ],
        // },
    ];




    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(to right, #141e30, #243b55)'
                    : 'linear-gradient(to right, #e0eafc, #cfdef3)',
            }}
        >
            <Sidebar items={items} />
            <Container sx={{ mt: 4, flexGrow: 1 }}>
                <Outlet />
            </Container>
        </Box>
    );
};

export default MainLayout;
