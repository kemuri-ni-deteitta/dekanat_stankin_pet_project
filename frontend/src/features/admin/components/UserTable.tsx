import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  TablePagination,
  Chip,
  FormControl,
  Select,
  OutlinedInput,
  Box,
  Typography,
  Avatar,
  Skeleton,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  styled
} from "@mui/material";
import {
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  School as StudentIcon,
  Work as EmployeeIcon,
  CastForEducation as TutorIcon,
  HowToReg as RegisteredIcon,
  AddCircleOutline as AddRoleIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { getRoles, getUsers, addRole, removeRole } from "../adminSlice";

const roleData = {
  ADMIN: { label: "Администратор", icon: <AdminIcon fontSize="small" />, color: "error" },
  STUDENT: { label: "Студент", icon: <StudentIcon fontSize="small" />, color: "primary" },
  EMPLOYEE: { label: "Сотрудник", icon: <EmployeeIcon fontSize="small" />, color: "success" },
  TUTOR: { label: "Преподаватель", icon: <TutorIcon fontSize="small" />, color: "warning" },
  REGISTERED: { label: "Зарегистрированный", icon: <RegisteredIcon fontSize="small" />, color: "default" },
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  backgroundColor: theme.palette.background.paper,
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    minHeight: '42px',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.primary.main, 0.2),
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.primary.main, 0.4),
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: 1,
  },
}));

const UsersTable = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.admin.users) || [];
  const allRoles = useAppSelector((state) => state.admin.roles) || [];
  const status = useAppSelector((state) => state.admin.status);
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (status === "idle") {
      dispatch(getUsers());
      dispatch(getRoles());
    }
  }, [dispatch, status]);

  const handleRoleSelect = async (email: string, role: string) => {
    try {
      await dispatch(addRole({ email, role }));
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  const handleRoleRemove = async (email: string, role: string) => {
    try {
      await dispatch(removeRole({ email, role }));
    } catch (error) {
      console.error("Error removing role:", error);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ 
      width: "100%", 
      overflow: "hidden",
      borderRadius: 3,
      boxShadow: theme.shadows[2],
      '&:hover': {
        boxShadow: theme.shadows[4],
      },
      transition: theme.transitions.create(['box-shadow'], {
        duration: theme.transitions.duration.standard,
      }),
    }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
        <Table stickyHeader aria-label="users table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: '40%' }}>Пользователь</StyledTableCell>
              <StyledTableCell sx={{ width: '60%' }}>Роли</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {status === "loading" ? (
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton width="60%" height={24} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Skeleton width="80%" height={40} />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length > 0 ? (
              users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow hover key={user.email} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <PersonIcon />
                        </Avatar>
                        <Typography variant="body1" fontWeight={500}>
                          {user.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <StyledSelect
                          multiple
                          value={Array.from(new Set(user.roles || []))}
                          input={<OutlinedInput />}
                          renderValue={(selected) => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                              {selected.map((value) => (
                                <Tooltip key={value} title="Удалить роль">
                                  <Chip
                                    variant="outlined"
                                    label={
                                      <Box display="flex" alignItems="center" gap={0.5}>
                                        {roleData[value]?.icon}
                                        {roleData[value]?.label || value}
                                      </Box>
                                    }
                                    onDelete={(e) => {
                                      e.stopPropagation();
                                      handleRoleRemove(user.email, value);
                                    }}
                                    deleteIcon={<DeleteIcon fontSize="small" />}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    color={roleData[value]?.color}
                                    sx={{
                                      borderRadius: 1,
                                      '& .MuiChip-deleteIcon': {
                                        color: 'inherit',
                                        opacity: 0.7,
                                        '&:hover': {
                                          opacity: 1
                                        }
                                      }
                                    }}
                                  />
                                </Tooltip>
                              ))}
                            </Box>
                          )}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 300,
                                width: 250,
                              },
                              sx: {
                                borderRadius: 2,
                                marginTop: 1,
                                boxShadow: theme.shadows[3],
                              }
                            },
                          }}
                        >
                          {allRoles.map((role) => (
                            <MenuItem
                              key={role}
                              value={role}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRoleSelect(user.email, role);
                              }}
                              sx={{
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                },
                                '&.Mui-selected': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                }
                              }}
                            >
                              <Box display="flex" alignItems="center" gap={1.5}>
                                {roleData[role]?.icon || <AddRoleIcon fontSize="small" />}
                                <Typography variant="body2">
                                  {roleData[role]?.label || role}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </StyledSelect>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} sx={{ textAlign: 'center', py: 4 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <PersonIcon fontSize="large" color="disabled" />
                    <Typography variant="body1" color="text.secondary">
                      Пользователи не найдены
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Строк на странице:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          '& .MuiTablePagination-toolbar': {
            paddingLeft: 2,
            paddingRight: 2,
          }
        }}
      />
    </Paper>
  );
};

export default UsersTable;