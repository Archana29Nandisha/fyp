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
  CircularProgress,
} from "@mui/material";

const API_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:7001/api" : "/api";

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ✅ Fetch Projects
  useEffect(() => {
    fetchProjects();
  }, [page, rowsPerPage]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/user/fullprojects`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { page: page + 1, limit: rowsPerPage }, // Convert zero-based page to one-based
      });

      setProjects(response.data.projects || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/user/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      alert("Project deleted successfully!");
      fetchProjects(); // Refresh the project list
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // ✅ Handle Page Change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // ✅ Handle Rows Per Page Change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
    fetchProjects();
  };

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
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        All Projects
      </Typography>

      {/* Show Loading Indicator */}
      {loading ? (
        <CircularProgress sx={{ color: "#fff", mt: 3 }} />
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            mt: 3,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            color: "#fff",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#1976d2" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Project Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Developer</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Status</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project._id}
                  sx={{
                    "&:hover": { background: "rgba(255, 255, 255, 0.2)" },
                  }}
                >
                  <TableCell sx={{ color: "#fff" }}>{project.name}</TableCell>
                  <TableCell sx={{ color: "#fff", textAlign: "center" }}>
                    {project.developer?.username || "Unknown"}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: project.approved ? "#4CAF50" : "#F44336",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {project.approved ? "Approved" : "Pending"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteProject(project._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <TablePagination
        sx={{ color: "#fff", mt: 2 }}
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={totalPages * rowsPerPage} // Approximate total projects count
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default AllProjects;
