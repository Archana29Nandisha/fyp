import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Pagination,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";

const API_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:7001/api" : "/api";

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [review, setReview] = useState("");
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [positiveCount, setPositiveCount] = useState(0);
  const [negativeCount, setNegativeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const reviewsPerPage = 3;

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/user/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
          params: { page: currentPage, limit: reviewsPerPage },
        });
        setProject(response.data.project);
        setTotalPages(response.data.totalPages);
        setPositiveCount(response.data.positiveCount);
        setNegativeCount(response.data.negativeCount);
      } catch (error) {
        console.error("Error fetching project details:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, currentPage, navigate]);

  const handleAddReview = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/user/reviews`,
        { projectId, content: review },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      alert("Review added successfully!");
      setReview("");
      setCurrentPage(1);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3c72, #2a5298, #6a11cb, #2575fc)",
        }}
      >
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

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
      {/* Back Button (Left Corner) */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "#fff",
            borderColor: "#fff",
            "&:hover": { background: "#ffffff30" },
          }}
        >
          Back
        </Button>
      </motion.div>

      {/* Project Details */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Typography variant="h4" fontWeight="bold">
          {project.name}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Location: {project.location}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Developer: {project.developer?.username}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, maxWidth: 600, mx: "auto" }}>
          {project.description}
        </Typography>
      </motion.div>

      {/* Review Statistics */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
          <Typography variant="body1" sx={{ color: "#4CAF50" }}>Positive Reviews: <strong>{positiveCount}</strong></Typography>
          <Typography variant="body1" sx={{ color: "#F44336" }}>Negative Reviews: <strong>{negativeCount}</strong></Typography>
          <Typography variant="body1">Total Reviews: <strong>{positiveCount + negativeCount}</strong></Typography>
        </Box>
      </motion.div>

      {/* Reviews List (Single Row) */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          overflowX: "auto",
          gap: 2,
          paddingBottom: 2,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {project.reviews.map((review, index) => (
          <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }}>
            <Card
              sx={{
                minWidth: 280,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#fff",
              }}
            >
              <CardContent>
                <Typography variant="body1">{review.content}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  By {review.user?.username} on {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
      </Box>

      {/* Add Review Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Add a Review</Typography>
        <TextField
          fullWidth
          label="Your Review"
          multiline
          rows={3}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          sx={{ mt: 2, background: "#ffffff30", borderRadius: 2, input: { color: "#fff" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" } }}
        />
        <Button variant="contained" onClick={handleAddReview} sx={{ mt: 2, background: "#21cbf3" }}>
          Submit Review
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectDetailsPage;
