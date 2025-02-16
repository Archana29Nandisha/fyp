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
} from "@mui/material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled } from "@mui/system";

const API_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:7001/api" : "/api";

const ProjectDetailsPage = () => {
  const { projectId } = useParams(); // Get project ID from URL
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [review, setReview] = useState("");
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [positiveCount, setPositiveCount] = useState(0);
  const [negativeCount, setNegativeCount] = useState(0);
  const reviewsPerPage = 3; // Number of reviews per page

  // Fetch project details and reviews
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/user/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
          params: { page: currentPage, limit: reviewsPerPage },
        });
        setProject(response.data.project);
        setTotalPages(response.data.totalPages);
        setPositiveCount(response.data.positiveCount); // Set total positive reviews
        setNegativeCount(response.data.negativeCount); // Set total negative reviews
      } catch (error) {
        console.error("Error fetching project details:", error);
        navigate("/");
      }
    };

    fetchProjectDetails();
  }, [projectId, currentPage, navigate]);

  // Handle adding a review
  const handleAddReview = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/user/reviews`,
        { projectId, content: review },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      alert("Review added successfully!");
      setReview("");
      // Refresh project details to show the new review
      const response = await axios.get(`${API_URL}/user/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { page: currentPage, limit: reviewsPerPage },
      });
      setProject(response.data.project);
      setTotalPages(response.data.totalPages);
      setPositiveCount(response.data.positiveCount); // Update total positive reviews
      setNegativeCount(response.data.negativeCount); // Update total negative reviews
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  // Sentiment indicator component
  const SentimentIndicator = styled("div")(({ sentiment }) => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: sentiment === "Positive" ? "#4CAF50" : "#F44336", // Green for positive, red for negative
    display: "inline-block",
    marginRight: "8px",
  }));

  // Handle page change for reviews
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Handle going back
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!project) {
    return <Typography>Loading project details...</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        sx={{ mb: 3 }}
      >
        Back to Projects
      </Button>
      <Typography variant="h4" gutterBottom>
        {project.name}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Location: {project.location}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Developer: {project.developer?.username}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Description: {project.description}
      </Typography>

      {/* Reviews Section */}
      {(role === "admin" || role === "developer") && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Reviews
          </Typography>
          {/* Display total positive and negative review counts */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Typography variant="body1">
                <div style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#4CAF50", // Green for positive, red for negative
                    display: "inline-block",
                    marginRight: "8px",
                }}/>
              Total Positive Reviews: <strong>{positiveCount}</strong> |
            </Typography>
            <Typography variant="body1">
            <div style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#F44336", // Green for positive, red for negative
                    display: "inline-block",
                    marginRight: "8px",
                }}/>
              Total Negative Reviews: <strong>{negativeCount}</strong> |
            </Typography>
            <Typography variant="body1">
              Total Reviews: <strong>{negativeCount+positiveCount}</strong>
            </Typography>
          </Box>
          {project.reviews.map((review, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <SentimentIndicator sentiment={review.sentiment} />
                  <Typography variant="body1">{review.content}</Typography>
                </Box>
                <Typography variant="caption">
                  By: {review.user?.username} on{" "}
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Box>
      )}

      {/* Add Review Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add a Review
        </Typography>
        <TextField
          fullWidth
          label="Your Review"
          multiline
          rows={4}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleAddReview}>
          Submit Review
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectDetailsPage;
