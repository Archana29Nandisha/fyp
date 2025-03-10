import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e3c72, #2a5298, #6a11cb, #2575fc)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              p: 4,
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" gutterBottom>
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.7)" },
                    "&:hover fieldset": { borderColor: "#fff" },
                    "&.Mui-focused fieldset": { borderColor: "#fff" },
                  },
                  input: { color: "#fff" },
                  label: { color: "#fff" },
                }}
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.7)" },
                    "&:hover fieldset": { borderColor: "#fff" },
                    "&.Mui-focused fieldset": { borderColor: "#fff" },
                  },
                  input: { color: "#fff" },
                  label: { color: "#fff" },
                }}
              />
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, background: "#21cbf3" }}>
                  Login
                </Button>
              </motion.div>
            </form>
          </Box>
        </Container>
      </motion.div>
    </Box>
  );
}

export default Login;
