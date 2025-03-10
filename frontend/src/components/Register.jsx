import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";

const API_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:7001/api" : "/api";

function Register() {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      alert(response.data.message);
    } catch (error) {
      alert("Registration failed: " + error.response.data.message);
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
              Register
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
                  Register
                </Button>
              </motion.div>
            </form>
          </Box>
        </Container>
      </motion.div>
    </Box>
  );
}

export default Register;
