import { Container, Typography } from '@mui/material';
import UsersTable from "../components/UserTable.tsx";

const AdminPage = () => {
    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Панель управления</Typography>
            <UsersTable/>
        </Container>
    );
};

export default AdminPage;
