import React from "react";
import { motion } from "framer-motion";
import { Container, Typography, Button, Box, Grid, Card, CardContent, AppBar, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import ParticlesBg from "particles-bg"; // Adds animated particles background

const LandingPage = () => {
  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="fixed" sx={{ background: "rgba(30, 60, 114, 0.9)", backdropFilter: "blur(10px)" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Review Analyser
          </Typography>
          <Button color="inherit" component={Link} to="/login" sx={{ mr: 2 }}>
            Login
          </Button>
          <Button variant="contained" color="secondary" component={Link} to="/register">
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Particles Background */}
      <ParticlesBg type="circle" bg={true} />

      {/* Hero Section with Gradient Background */}
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #1e3c72, #2a5298, #6a11cb, #2575fc)",
          color: "#fff",
          textAlign: "center",
          position: "relative",
        }}
      >
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
            Welcome to Review Analyser
          </Typography>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
          <Typography variant="h5" sx={{ mb: 4 }}>
            An AI-powered system to analyze and classify reviews efficiently.
          </Typography>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 1 }}>
          <Button variant="contained" color="secondary" size="large" sx={{ px: 4, py: 2 }} component={Link} to="/register">
            Get Started
          </Button>
        </motion.div>
      </Box>

      {/* Features Section with a Gradient Background */}
      <Box
        sx={{
          py: 8,
          background: "linear-gradient(135deg, #4b6cb7, #182848)",
          color: "#fff",
        }}
        id="features"
      >
        <Container>
          <Typography variant="h4" sx={{ textAlign: "center", mb: 4 }}>
            Why Choose Us?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {["Accurate Analysis", "Real-time Processing", "Easy Integration"].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.3 }}>
                  <Card
                    sx={{
                      height: "100%",
                      background: "rgba(255, 255, 255, 0.15)", // Transparent white
                      backdropFilter: "blur(10px)", // Blur effect
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                      color: "#fff",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5">{feature}</Typography>
                      <Typography variant="body2">
                        {feature === "Accurate Analysis"
                          ? "Leverages AI and NLP to analyze sentiments with high accuracy."
                          : feature === "Real-time Processing"
                          ? "Processes customer reviews instantly for actionable insights."
                          : "Seamlessly integrates with various platforms via APIs."}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box sx={{ py: 4, backgroundColor: "#1976d2", color: "#fff", textAlign: "center" }}>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Archana. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default LandingPage;
