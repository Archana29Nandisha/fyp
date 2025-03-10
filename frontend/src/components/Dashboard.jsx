import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Import Components
import Sidebar from "./Sidebar";
import ApproveProject from "./onlyAdmin/approveProject";
import AddProject from "./bothDeveloperandAdmin/addProject";
import HomePage from "./HomePage";
import AddReview from "./AddReview";
import AllProjects from "./onlyAdmin/AllProjects";
import UserManagement from "./onlyAdmin/UserManagement";
import UserProfile from "./UserProfile";

const API_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:7001/api" : "/api";

function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", description: "", location: "" });
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [currentTab, setCurrentTab] = useState("Home");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get(`${API_URL}/user/projects`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { page: currentPage, limit: 5, location: selectedLocation },
      });
      setProjects(response.data.projects);
      setTotalPages(response.data.totalPages);
      setApprovedProjects(response.data.projects.filter((p) => p.approved));
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, selectedLocation]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const handleProjectCardClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "linear-gradient(135deg, #1e3c72, #2a5298, #6a11cb, #2575fc)", color: "#fff" }}>
      {/* Sidebar Navigation */}
      <Sidebar role={role} handleTabChange={handleTabChange} handleLogout={handleLogout} />

      {/* Main Content */}
      <Container sx={{ flexGrow: 1, overflowY: "auto", py: 4 }}>

        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", color: "#fff" }} />
        ) : (
          <>
            {currentTab === "Home" && <HomePage />}
            {currentTab === "Profile" && <UserProfile />}

            {currentTab === "Add Review" && (
              <AddReview
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                approvedProjects={approvedProjects}
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                handleProjectCardClick={handleProjectCardClick}
                role={role}
              />
            )}

            {currentTab === "Add Project" && role !== "user" && (
              <AddProject newProject={newProject} setNewProject={setNewProject} fetchProjects={fetchProjects} />
            )}

            {currentTab === "Approve Projects" && role === "admin" && (
              <ApproveProject
                approvedProjects={projects.filter((p) => p.approved)}
                pendingProjects={projects.filter((p) => !p.approved)}
              />
            )}

            {currentTab === "User Management" && role === "admin" && <UserManagement />}

            {currentTab === "Projects" && role === "admin" && <AllProjects />}
          </>
        )}
      </Container>
    </Box>
  );
}

export default Dashboard;
