import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Select,
  MenuItem,
} from "@mui/material";

const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:7001/api" : "/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // ✅ Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/user/users`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { page: page + 1, limit: rowsPerPage },
      });

      setUsers(response.data.users || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update User Role
  const handleRoleChange = async (userId, newRole) => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.put(`${API_URL}/user/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  // ✅ Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/user/users/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // ✅ Render Table
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72, #2a5298, #6a11cb, #2575fc)",
        color: "#fff",
        textAlign: "center",
        py: 6,
        px: 3,
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: 800,
          mx: "auto",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          p: 3,
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
          User Management
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            color: "#fff",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#1976d2" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Role</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user._id}
                  sx={{
                    "&:hover": { background: "rgba(255, 255, 255, 0.2)" },
                  }}
                >
                  <TableCell sx={{ color: "#fff" }}>{user.username}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      sx={{
                        background: "#fff",
                        borderRadius: 2,
                        "& .MuiSvgIcon-root": { color: "#000" },
                      }}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="developer">Developer</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button variant="contained" color="error" onClick={() => handleDeleteUser(user._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={totalPages * rowsPerPage}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </Box>
    </Box>
  );
};

export default UserManagement;
