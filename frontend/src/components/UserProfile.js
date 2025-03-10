import React, { useState, useEffect } from "react";
import {
  Card, CardContent, Typography, Box, Button, CircularProgress, Avatar, IconButton, TextField
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";

const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:7001/api" : "/api";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageFile(file);
    setUploading(true);

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.put(`${API_URL}/user/${user._id}/profile-image`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile picture updated successfully!");
      setUser({ ...user, profileImage: response.data.profileImage });
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      const authToken = localStorage.getItem("authToken");

      await axios.delete(`${API_URL}/user/${user._id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      alert("Account deleted successfully!");
      localStorage.removeItem("authToken");
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account.");
    }
  };

  if (loading) return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 5, textAlign: "center" }}>
      <Card sx={{ background: "linear-gradient(to right, #1e3c72, #2a5298)", color: "#fff", padding: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>Profile</Typography>

          {/* Profile Image */}
          <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
            <Avatar
              src={user.profileImage ? `${API_URL.replace("/api", "")}${user.profileImage}` : "/default-avatar.png"}
              sx={{ width: 120, height: 120, margin: "auto", border: "3px solid white" }}
            />
            <IconButton
              component="label"
              sx={{ position: "absolute", bottom: 0, right: 0, background: "#fff" }}
            >
              <PhotoCamera />
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </IconButton>
          </Box>

          {uploading && <Typography variant="body2" sx={{ mt: 1, color: "yellow" }}>Uploading...</Typography>}

          <Typography variant="h6">Username: {user.username}</Typography>

          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleDeleteAccount}
            sx={{ mt: 3 }}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;
