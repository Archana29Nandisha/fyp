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
  Card,
  CardContent,
  CardHeader,
  Pagination,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";
import ApproveProject from "./onlyAdmin/approveProject";
import AddProject from "./bothDeveloperandAdmin/addProject";

const API_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:7001/api" : "/api";

const districts = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale",
  "Nuwara Eliya", "Galle", "Matara", "Hambantota", "Jaffna",
  "Mannar", "Vavuniya", "Mullaitivu", "Kilinochchi", "Batticaloa",
  "Ampara", "Trincomalee", "Kurunegala", "Puttalam", "Anuradhapura",
  "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle"
];

function Dashboard() {
  const navigate = useNavigate(); // For navigation
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [review, setReview] = useState("");
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    location: "",
  });
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState("");

  // Fetch projects from the backend
  const fetchProjects = async () => {  // Make the function async
    const authToken = localStorage.getItem("authToken");
    const params = {
      page: currentPage,
      limit: 5,
      location: selectedLocation,
    };
  
    try {
      const response = await axios.get(`${API_URL}/user/projects`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params,
      });
  
      const projects = response.data.projects;
    
      setProjects(projects);
      setTotalPages(response.data.totalPages);
      setApprovedProjects(projects.filter((project) => project.approved));
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  // Fetch projects on component mount or when page/location changes
  useEffect(() => {
    fetchProjects();
  }, [currentPage, selectedLocation]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  // Handle adding a review (not used in this version, moved to ProjectDetailsPage)
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
        fetchProjects();
      })
      .catch((error) => console.error("Error adding review:", error));
  };

  // Handle deleting a project
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
        fetchProjects();
      })
      .catch((error) => console.error("Error deleting project:", error));
  };

  // Handle adding a new project
  const handleAddProject = () => {
    const authToken = localStorage.getItem("authToken");

    axios
      .post(
        `${API_URL}/user/projects`,
        newProject,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then(() => {
        alert("Project added successfully!");
        setNewProject({ name: "", description: "", location: "" });
        fetchProjects();
      })
      .catch((error) => console.error("Error adding project:", error));
  };

  // Handle approving a project
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
        fetchProjects();
      })
      .catch((error) => console.error("Error approving project:", error));
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Handle clicking on a project card
  const handleProjectCardClick = (projectId) => {
    navigate(`/project/${projectId}`); // Navigate to project details page
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
          <div>
            {/* Filter by District */}
            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
              <InputLabel>Filter by District</InputLabel>
              <Select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                label="Filter by District"
              >
                <MenuItem value="">All Districts</MenuItem>
                {districts.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Project Cards */}
            <Grid container spacing={3}>
              {approvedProjects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project._id}>
                  <Card onClick={() => handleProjectCardClick(project._id)}>
                    <CardHeader title={project.name} />
                    <CardContent>
                      <Typography>Location: {project.location}</Typography>
                      <Typography>Developer: {project.developer?.username}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          </div>
        )}

        {currentTab === 1 && (role === "admin" || role === "developer") && (
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
