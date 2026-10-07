// features/institutes/pages/InstituteAdminPage.tsx
import React from "react";
import InstituteTable from "../components/InstituteTable";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const InstituteAdminPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAddInstitute = () => {
    navigate("/institutes/create");
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Управление институтом</Typography>

      </Box>
      <InstituteTable />
    </div>
  );
};

export default InstituteAdminPage;
