import React from "react";
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

const districts = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale",
  "Nuwara Eliya", "Galle", "Matara", "Hambantota", "Jaffna",
  "Mannar", "Vavuniya", "Mullaitivu", "Kilinochchi", "Batticaloa",
  "Ampara", "Trincomalee", "Kurunegala", "Puttalam", "Anuradhapura",
  "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle"
];

const AddProject = ({ newProject, setNewProject, handleAddProject }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box sx={{ mt: 4, p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add New Project
      </Typography>

      <TextField
        fullWidth
        label="Project Name"
        name="name"
        value={newProject.name || ''}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Description"
        name="description"
        value={newProject.description || ''}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={4}
        required
      />

      <FormControl fullWidth margin="normal" required>
        <InputLabel>Location</InputLabel>
        <Select
          name="location"
          value={newProject.location || ''}
          label="Location"
          onChange={handleChange}
        >
          {districts.map(district => (
            <MenuItem key={district} value={district}>
              {district}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleAddProject}
        disabled={!newProject.name || !newProject.description || !newProject.location}
      >
        Submit Project
      </Button>
    </Box>
  );
};

export default AddProject;
