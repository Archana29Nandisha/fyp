import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:7001/api" : "/api";

const districts = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale",
  "Nuwara Eliya", "Galle", "Matara", "Hambantota", "Jaffna",
  "Mannar", "Vavuniya", "Mullaitivu", "Kilinochchi", "Batticaloa",
  "Ampara", "Trincomalee", "Kurunegala", "Puttalam", "Anuradhapura",
  "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle"
];

const AddProject = ({ fetchProjects }) => {
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    location: "",
    image: null,
    mapLocation:""
  });

  const [previewImage, setPreviewImage] = useState(null);

  // Handles form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  // Handles image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setNewProject((prev) => ({ ...prev, image: file }));

      // Preview the image before uploading
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to Add Project via API
  const handleAddProject = async () => {
    if (!newProject.name || !newProject.description || !newProject.location || !newProject.image || !newProject.mapLocation)  {
      alert("All fields including an image are required!");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("name", newProject.name);
      formData.append("description", newProject.description);
      formData.append("location", newProject.location);
      formData.append("image", newProject.image); // Append the image file
      formData.append("mapLocation", newProject.mapLocation); 

      await axios.post(`${API_URL}/user/projects`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data", // Ensure proper handling of files
        },
      });

      alert("Project added successfully!");
      setNewProject({ name: "", description: "", location: "", image: null });
      setPreviewImage(null);
      fetchProjects(); // Refresh projects list
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72, #2a5298, #6a11cb, #2575fc)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        py: 6,
        px: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
          p: 4,
          color: "#fff",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
          Add New Project
        </Typography>

        <TextField
          fullWidth
          label="Project Name"
          name="name"
          value={newProject.name}
          onChange={handleChange}
          margin="normal"
          required
          InputProps={{
            sx: {
              color: "#fff",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
            },
          }}
          InputLabelProps={{ sx: { color: "#fff" } }}
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={newProject.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          required
          InputProps={{
            sx: {
              color: "#fff",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
            },
          }}
          InputLabelProps={{ sx: { color: "#fff" } }}
        />
  <TextField
          fullWidth
          label="Map Location(Open google map and go to share and select embeded a map and copy html and paste it here)"
          name="mapLocation"
          value={newProject.mapLocation}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          required
          InputProps={{
            sx: {
              color: "#fff",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
            },
          }}
          InputLabelProps={{ sx: { color: "#fff" } }}
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel sx={{ color: "#fff" }}>Location</InputLabel>
          <Select
            name="location"
            value={newProject.location}
            onChange={handleChange}
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
            }}
          >
            {districts.map(district => (
              <MenuItem key={district} value={district}>
                {district}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Image Upload Section */}
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} id="upload-image" />
        <label htmlFor="upload-image">
          <Button variant="contained" component="span" sx={{ mt: 2, background: "#21cbf3" }}>
            Upload Project Image
          </Button>
        </label>

        {/* Image Preview */}
        {previewImage && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <img src={previewImage} alt="Preview" style={{ maxWidth: "100%", borderRadius: 8 }} />
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, py: 1.5, fontWeight: "bold", background: "#21cbf3" }}
          onClick={handleAddProject}
          disabled={!newProject.name || !newProject.description || !newProject.location || !newProject.image}
        >
          Submit Project
        </Button>
      </Box>
    </Box>
  );
};

export default AddProject;
