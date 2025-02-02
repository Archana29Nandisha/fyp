import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:7001/api" : "/api";
function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);

      // Destructure token from the response data
      const { token, role } = response.data;

      // Save the token securely in localStorage
      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);

        // Set token as default header for future Axios requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert("No token received from the server.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert("Login failed: " + error.response.data.message);
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{ mt: 8, p: 3, borderRadius: 2, boxShadow: 3, textAlign: "center" }}
      >
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            variant="outlined"
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;
