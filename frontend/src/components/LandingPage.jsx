import React from "react";
import { motion } from "framer-motion";
import { Container, Typography, Button, Box, Grid, Card, CardContent, AppBar, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import ParticlesBg from "particles-bg"; // Adds animated particles background
import { Building2, Users, BarChart as ChartBar, MessageSquare, Lightbulb, Target } from "lucide-react";

const LandingPage = () => {
  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="fixed" sx={{ background: "rgba(30, 60, 114, 0.9)", backdropFilter: "blur(10px)" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Smart Urban
          </Typography>
          <Button color="inherit" component={Link} to="/login" sx={{ mr: 2, background: "#21cbf3" }}>
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
            Crowdsourced Urban Development Platform
          </Typography>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
          <Typography variant="h5" sx={{ mb: 4 }}>
            An AI-powered system where user feedbacks analyze
          </Typography>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 1 }}>
          <Button variant="contained" color="secondary" size="large" sx={{ px: 4, py: 2 }} component={Link} to="/register">
            Get Started
          </Button>
        </motion.div>
      </Box>

      {/* Urban Development Projects in Sri Lanka */}
      <Box sx={{ py: 8, background: "linear-gradient(135deg, #2a5298, #1e3c72)", color: "#fff" }}>
        <Container>
          <Typography variant="h4" sx={{ textAlign: "center", mb: 4, fontWeight: "bold" }}>
            Urban Development Projects in Sri Lanka
          </Typography>
          <Grid container spacing={4}>
            {[{
              title: "Port City Colombo",
              description: "A futuristic city built on reclaimed land, enhancing Sri Lanka's economic growth and sustainability.",
              image: "/images/6-940x500.jpg"
            },
            {
              title: "Megapolis Development Plan",
              description: "A long-term urbanization plan aiming to improve infrastructure, transportation, and smart city initiatives.",
              image: "/images/DJI_0040.jpg"
            },
            {
              title: "Light Rail Transit Project",
              description: "A major transportation project designed to reduce congestion and modernize Sri Lanka's public transit system.",
              image: "/images/image_2dbe41f5e8.jpg"
            }].map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} component={Link} to="/login"   sx={{ textDecoration: 'none' }}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.2 }}>
                  <Card sx={{ height: "100%", bgcolor: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.3)", boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", color: "#fff" }}>
                    <img src={project.image} alt={project.title} style={{ width: "100%", height: "200px", objectFit: "cover", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }} />
                    <CardContent>
                      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>{project.title}</Typography>
                      <Typography variant="body2">{project.description}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
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
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 10 }}>
        <Typography variant="h2" sx={{ color: 'white', textAlign: 'center', mb: 8, fontWeight: 'bold' }}>
          Empowering Community-Driven Urban Development
        </Typography>
        <Grid container spacing={4}>
          {[{ icon: <Users color="white" />, title: "Community Engagement", description: "Direct participation in urban planning decisions through real-time feedback and suggestions." },
            { icon: <ChartBar color="white" />, title: "Data-Driven Insights", description: "Advanced NLP analysis of public sentiment to guide smart urban development decisions." },
            { icon: <MessageSquare color="white" />, title: "Transparent Communication", description: "Open dialogue between residents, urban planners, and policymakers." },
            { icon: <Lightbulb color="white" />, title: "Smart Solutions", description: "AI-powered categorization of feedback for efficient project planning and execution." },
            { icon: <Target color="white" />, title: "Focused Development", description: "Targeted improvements based on community needs and priorities." },
            { icon: <Building2 color="white" />, title: "Sustainable Growth", description: "Balanced urban development that considers both present needs and future sustainability." }].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Card sx={{ bgcolor: 'rgba(30, 60, 114, 0.3)', backdropFilter: 'blur(10px)', border: '1px solid rgba(42, 82, 152, 0.5)', borderRadius: 2, p: 3, height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                    <Box sx={{ color: 'white', mb: 4 }}>{feature.icon}</Box>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>{feature.title}</Typography>
                    <Typography sx={{ color: '#bbdefb' }}>{feature.description}</Typography>
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
          &copy; {new Date().getFullYear()} SmartUrban. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default LandingPage;

