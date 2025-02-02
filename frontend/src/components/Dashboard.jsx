import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  AppBar,
  Tabs,
  Tab,
  Toolbar,
} from "@mui/material";
import axios from "axios";
import ApproveProject from "./onlyAdmin/approveProject";
import AddProject from "./bothDeveloperandAdmin/addProject";

const API_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:7001/api" : "/api";
function Dashboard() {
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [review, setReview] = useState("");
  const [newProject, setNewProject] = useState("");
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [currentTab, setCurrentTab] = useState(0); // Tab index for navigation

  // Fetch projects from the backend
  const fetchProjects = () => {
    const authToken = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole"); // Assume role is stored in localStorage
    setRole(userRole);
    axios
      .get(`${API_URL}/user/projects`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        const allProjects = response.data.projects;
        setProjects(allProjects); // Store all projects
        setApprovedProjects(allProjects.filter((project) => project.approved)); // Filter approved projects
      })
      .catch((error) => console.error("Error fetching projects:", error));
  };

  useEffect(() => {
    fetchProjects(); // Initial fetch on component mount
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    window.location.href = "/login"; // Redirect to login page
  };

  const handleAddReview = () => {
    const authToken = localStorage.getItem("authToken");

    axios
      .post(
        `${API_URL}/user/reviews`,
        { projectId: selectedProject, review },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then(() => {
        alert("Review added successfully!");
        setReview("");
        setSelectedProject("");
        fetchProjects(); // Refresh projects after adding a review
      })
      .catch((error) => console.error("Error adding review:", error));
  };

  const handleDeleteProject = (projectId) => {
    const authToken = localStorage.getItem("authToken");

    axios
      .delete(`${API_URL}/user/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then(() => {
        alert("Project deleted successfully!");
        fetchProjects(); // Refresh projects after deletion
      })
      .catch((error) => console.error("Error deleting project:", error));
  };

  const handleAddProject = () => {
    const authToken = localStorage.getItem("authToken");

    axios
      .post(
        `${API_URL}/user/projects`,
        { name: newProject },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then(() => {
        alert("Project added successfully!");
        setNewProject("");
        fetchProjects(); // Refresh projects after adding a project
      })
      .catch((error) => console.error("Error adding project:", error));
  };

  const handleApproveProject = (projectId) => {
    const authToken = localStorage.getItem("authToken");

    axios
      .put(
        `${API_URL}/user/projects/${projectId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then(() => {
        alert("Project approved successfully!");
        fetchProjects(); // Refresh projects after approval
      })
      .catch((error) => console.error("Error approving project:", error));
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboards
        </Typography>

        {/* Logout Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        {/* Navigation Tabs */}
        <AppBar position="static" sx={{ marginBottom: 2 }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                indicatorColor="secondary"
                textColor="inherit"
                variant="fullWidth"
              >
                <Tab label="Add Review" />
                {(role === "admin" || role === "developer") && (
                  <Tab label="Add Project" />
                )}
                {role === "admin" && <Tab label="Approve Projects" />}
              </Tabs>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Tab Content */}
        {currentTab === 0 && (
          <Box>
            <Typography variant="h6">Add a Review</Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Project</InputLabel>
              <Select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                {approvedProjects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Your Review"
              variant="outlined"
              sx={{ mt: 2 }}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleAddReview}
              disabled={!selectedProject || !review}
            >
              Submit Review
            </Button>
          </Box>
        )}

        {currentTab === 1 && role !== "guest" && (
          <AddProject
            newProject={newProject}
            setNewProject={setNewProject}
            handleAddProject={handleAddProject}
          />
        )}

        {currentTab === 2 && role === "admin" && (
          <ApproveProject
            approvedProjects={projects.filter((project) => project.approved)}
            pendingProjects={projects.filter((project) => !project.approved)}
            allProjects={projects}
            handleApproveProject={handleApproveProject}
            handleDeleteProject={handleDeleteProject}
          />
        )}
      </Box>
    </Container>
  );
}

export default Dashboard;
