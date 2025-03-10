import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
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

const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:7001/api" : "/api";

const ApproveProject = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [approvedPage, setApprovedPage] = useState(0);
  const [pendingPage, setPendingPage] = useState(0);
  const [approvedTotalPages, setApprovedTotalPages] = useState(1);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  // Fetch projects from API
  useEffect(() => {
    fetchProjects();
  }, [approvedPage, pendingPage]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/user/allprojects`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const projects = response.data.projects || [];
      setApprovedProjects(response.data.approvedProjects || []);
      setPendingProjects(response.data.pendingProjects || []);
      setApprovedTotalPages(Math.ceil(projects.filter((p) => p.approved).length / rowsPerPage));
      setPendingTotalPages(Math.ceil(projects.filter((p) => !p.approved).length / rowsPerPage));
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Approve project
  const handleApproveProject = async (projectId) => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.put(`${API_URL}/user/projects/${projectId}/approve`, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      alert("Project approved successfully!");
      fetchProjects(); // Refresh the project list
    } catch (error) {
      console.error("Error approving project:", error);
    }
  };

  // Delete project
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

  // Handle tab change
  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  // Handle page changes
  const handleChangePage = (event, newPage) => {
    if (tabIndex === 0) setApprovedPage(newPage);
    else setPendingPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setApprovedPage(0);
    setPendingPage(0);
    fetchProjects();
  };

  // Table rendering function
  const renderTable = (projects, isPending) => (
    <>
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
              <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects
              .slice(
                isPending ? pendingPage * rowsPerPage : approvedPage * rowsPerPage,
                isPending ? pendingPage * rowsPerPage + rowsPerPage : approvedPage * rowsPerPage + rowsPerPage
              )
              .map((project) => (
                <TableRow
                  key={project._id}
                  sx={{
                    "&:hover": { background: "rgba(255, 255, 255, 0.2)" },
                  }}
                >
                  <TableCell sx={{ color: "#fff" }}>{project.name}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {isPending ? (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleApproveProject(project._id)}
                      >
                        Approve
                      </Button>
                    ) : (
                      <Button variant="contained" disabled sx={{ background: "#4CAF50", color: "#fff" }}>
                        Approved
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteProject(project._id)}
                      sx={{ ml: 2 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{ color: "#fff", mt: 2 }}
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={isPending ? pendingProjects.length : approvedProjects.length}
        rowsPerPage={rowsPerPage}
        page={isPending ? pendingPage : approvedPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );

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
          Manage Projects
        </Typography>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            background: "rgba(255, 255, 255, 0.15)",
            borderRadius: 2,
            "& .MuiTabs-indicator": { backgroundColor: "#21cbf3" },
            "& .MuiTab-root": { color: "#fff", fontWeight: "bold" },
            "& .Mui-selected": { color: "#21cbf3" },
          }}
        >
          <Tab label="Approved Projects" />
          <Tab label="Pending Approval" />
        </Tabs>

        {loading ? (
          <CircularProgress sx={{ mt: 3, color: "#fff" }} />
        ) : (
          <Box sx={{ mt: 3 }}>
            {tabIndex === 0 && renderTable(approvedProjects, false)}
            {tabIndex === 1 && renderTable(pendingProjects, true)}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ApproveProject;
