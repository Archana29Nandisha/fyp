import React from "react";
import { Box, Typography, Button, TextField } from "@mui/material";

const AddProject = ({ newProject, setNewProject, handleAddProject }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Add a New Project</Typography>
      <TextField
        fullWidth
        label="Project Name"
        variant="outlined"
        sx={{ mt: 2 }}
        value={newProject}
        onChange={(e) => setNewProject(e.target.value)}
      />
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleAddProject}
        disabled={!newProject}
      >
        Add Project
      </Button>
    </Box>
  );
};

export default AddProject;
