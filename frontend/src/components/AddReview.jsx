import React, { useState, useEffect } from "react";
import {
  Grid, Card, CardContent, CardHeader, Typography, Box, Pagination, Button, TextField, CircularProgress,FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:7001/api" : "/api";

const AddReview = () => {
    const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [positiveCount, setPositiveCount] = useState(0);
  const [negativeCount, setNegativeCount] = useState(0);
  const [error, setError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchName, setSearchName] = useState("");

  // Pagination states
  const [projectPage, setProjectPage] = useState(1);
  const [projectTotalPages, setProjectTotalPages] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);

  const districts = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale",
    "Nuwara Eliya", "Galle", "Matara", "Hambantota", "Jaffna",
    "Mannar", "Vavuniya", "Mullaitivu", "Kilinochchi", "Batticaloa",
    "Ampara", "Trincomalee", "Kurunegala", "Puttalam", "Anuradhapura",
    "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle"
  ];

  // Pagination limits
  const projectsPerPage = 5;
  const reviewsPerPage = 3;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects();
    }, 500);  // Debounce to avoid excessive API calls
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchName, selectedDistrict, projectPage]);
  
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/user/projects`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { 
          page: projectPage, 
          limit: projectsPerPage, 
          location: selectedDistrict ? selectedDistrict : undefined, 
          name: searchName ? searchName.trim() : undefined  // Ensure empty search is ignored
        },
      });

      console.log("API Response:", response.data); // Debugging step
      setProjects(response.data.projects || []);
      setProjectTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
};


  const fetchReviews = async (projectId, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/user/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { page, limit: reviewsPerPage },
      });

      if (response.data && response.data.project) {
        setReviews(response.data.project.reviews || []);
        setPositiveCount(response.data.positiveCount || 0);
        setNegativeCount(response.data.negativeCount || 0);
        setReviewPage(page);
        setReviewTotalPages(response.data.totalPages || 1);
      } else {
        setReviews([]);
        setPositiveCount(0);
        setNegativeCount(0);
        setReviewTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to fetch reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCardClick = (project) => {
    setSelectedProject(project);
    setReviewPage(1);
    fetchReviews(project._id);
  };

  const handleGoBack = () => {
    setSelectedProject(null);
    setReviews([]);
    setPositiveCount(0);
    setNegativeCount(0);
    setError(null);
  };

  const handleAddReview = async () => {
    if (review.trim() === "") {
      alert("Please enter a review before submitting.");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post(`${API_URL}/user/reviews`, {
        projectId: selectedProject._id,
        content: review,
      }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      alert("Review added successfully!");
      setReview("");
      fetchReviews(selectedProject._id, reviewPage);
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to add review. Please try again.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e3c72, #2a5298, #6a11cb, #2575fc)", color: "#fff", textAlign: "center", py: 6, px: 3, borderRadius: 3, position: "relative" }}>
      {selectedProject ? (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ position: "absolute", top: "20px", left: "20px", color: "#fff", borderColor: "#fff", "&:hover": { background: "#ffffff30" } }}>
            Back
          </Button>

          <Typography variant="h4" fontWeight="bold" sx={{ mt: 4 }}>{selectedProject.name}</Typography>
          <Box sx={{ 
  display: 'flex', 
  gap: 1, 
  flexDirection: { xs: 'column', sm: 'row' }, 
  alignItems: 'stretch' 
}}>
  {/* Image Container */}
  <Box sx={{ flex: 1 }}>
    {selectedProject.image ? (
      <img
        src={`${API_URL.replace("/api", "")}${selectedProject.image}`}
        style={{
          width: "100%",
          height: "180px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    ) : (
      <Box
        sx={{
          width: "100%",
          height: "180px",
          background: "rgba(255, 255, 255, 0.3)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          opacity: 0.7,
        }}
      >
        No Image Available
      </Box>
    )}
  </Box>

  {/* Map Container */}
  {selectedProject.mapLocation ? (
     <Box sx={{ 
      flex: 1, 
      height: { xs: '300px', sm: '40px' },
      '& iframe': {
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        border: 0
      }
    }}>
   <div dangerouslySetInnerHTML={{ 
      __html: selectedProject.mapLocation.replace(/\sstyle=(["']).*?\1/gi, '') 
    }} />  </Box>
  ):(
    <Box sx={{ 
      flex: 1, 
      height: { xs: '300px', sm: '40px' },
      '& iframe': {
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        border: 0
      }
    }}>
  No Map location found  </Box>
  )}
 
</Box>
          <Typography variant="h6" sx={{ mt: 0 }}>Location: {selectedProject.location}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>Developer: {selectedProject.developer?.username || "Unknown"}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>{selectedProject.description|| "no description"}</Typography>

          {/* Review Statistics */}
          {role !== "user" && 
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
            <Typography variant="body1" sx={{ color: "#4CAF50",fontSize: '1.2rem' }}>Positive: <strong>{positiveCount}</strong></Typography>
            <Typography variant="body1" sx={{ color: "#F44336",fontSize: '1.2rem' }}>Negative: <strong>{negativeCount}</strong></Typography>
            <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>Total: <strong>{positiveCount + negativeCount}</strong></Typography>
          </Box>
}
          {/* Reviews with Pagination */}
          {role !== "user" && 
          <Box sx={{ mt: 4 }}>
          {reviews.length === 0 ? (
            <Typography sx={{ color: "#fff", opacity: 0.8 }}>No reviews available.</Typography>
          ) : (
            reviews.map((review, index) => (
              <Card key={index} sx={{ mb: 2, background: "rgba(255, 255, 255, 0.15)", color: "#fff" }}>
                <CardContent>
                  <Typography variant="body1">{review.content}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>By {review.user?.username} on {new Date(review.createdAt).toLocaleDateString()}</Typography>
                </CardContent>
              </Card>
            ))
          )}
          <Pagination count={reviewTotalPages} page={reviewPage} onChange={(e, page) => fetchReviews(selectedProject._id, page)} color="primary" sx={{ mt: 3 }} />
        </Box>
          }

          

          {/* Add Review */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5">Add a Review</Typography>
            <TextField fullWidth label="Your Review" multiline rows={3} value={review} onChange={(e) => setReview(e.target.value)} sx={{ mt: 2, background: "#ffffff30", borderRadius: 2, input: { color: "#fff" } }} />
            <Button variant="contained" onClick={handleAddReview} sx={{ mt: 2, background: "#21cbf3" }}>
              Submit Review
            </Button>
          </Box>
        </motion.div>
      ) : (
        <>
          <Typography variant="h4" mb={3}>Select a Project</Typography>
          <TextField
  fullWidth
  label="Search by Name"
  value={searchName}
  onChange={(e) => {setSearchName(e.target.value);
    setProjectPage(1);
  } } // No need to manually reset page, handled in useEffect
  sx={{ 
    mb: 3, 
    background: "#ffffff30", 
    borderRadius: 2, 
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      "& fieldset": { borderColor: "#fff" },
      "&:hover fieldset": { borderColor: "#fff" },
      "&.Mui-focused fieldset": { borderColor: "#fff" }
    },
    "& .MuiInputLabel-root": { color: "#fff" }
  }}
/>

          {/* District Filter */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ color: "#fff" }}>Filter by District</InputLabel>
            <Select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setProjectPage(1); // Add this line
              }}              sx={{ background: "#ffffff30", borderRadius: 2, color: "#fff", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" } }}
            >
              <MenuItem value="">All Districts</MenuItem>
              {districts.map((district) => (
                <MenuItem key={district} value={district}>{district}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid container spacing={3} justifyContent="center">
              {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project._id}>
                  <Card
                    onClick={() => handleProjectCardClick(project)}
                    sx={{
                      p: 2,
                      background: "rgba(255, 255, 255, 0.2)",
                      color: "#fff",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    {/* Display Project Image */}
                    {project.image ? (
                   <img
                   src={`${API_URL.replace("/api", "")}${project.image}`} // Adjusts the base URL correctly
                   alt={project.name}
                   style={{
                     width: "100%",
                     height: "180px",
                     objectFit: "cover",
                     borderRadius: "8px",
                     marginBottom: "10px",
                   }}
                 />
                 
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "180px",
                          background: "rgba(255, 255, 255, 0.3)",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          opacity: 0.7,
                        }}
                      >
                        No Image Available
                      </Box>
                    )}

                    <CardHeader
                      title={project.name}
                      subheader={`Developer: ${project.developer?.username || "Unknown"}`}
                      sx={{ textAlign: "center", fontWeight: "bold" }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>

          <Pagination count={projectTotalPages} page={projectPage} onChange={(e, page) => setProjectPage(page)} color="primary" sx={{ mt: 4 }} />
        </>
      )}
    </Box>
  );
};

export default AddReview;
