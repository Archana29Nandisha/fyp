import React from "react";
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const projects = [
  {
    id: 1,
    title: "AI-Based Review Analyzer",
    description: "An AI-powered system that analyzes customer reviews and provides sentiment insights.",
    image: "https://source.unsplash.com/600x400/?technology,ai",
  },
  {
    id: 2,
    title: "Urban Development Feedback System",
    description: "A crowdsourced platform for urban planning feedback with NLP-based sentiment analysis.",
    image: "https://source.unsplash.com/600x400/?city,urban",
  },
];

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e3c72, #2a5298, #6a11cb, #2575fc)",
        color: "#fff",
        textAlign: "center",
      }}
    >
      {/* Introduction Section */}
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to Our Project
        </Typography>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
        <Typography variant="h6" color="rgba(255, 255, 255, 0.8)" sx={{ mb: 4, maxWidth: 700 }}>
          We provide AI-powered insights and feedback mechanisms to enhance project efficiency and decision-making.
        </Typography>
      </motion.div>

      {/* Featured Projects Section */}
      <Container>
        <Grid container spacing={4} justifyContent="center">
          {projects.map((project, index) => (
            <Grid item xs={12} sm={6} key={project.id}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.3 }}>
                <Card
                  sx={{
                    maxWidth: 400,
                    mx: "auto",
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.15)", // Glass effect
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
                    color: "#fff",
                  }}
                >
                  <CardMedia component="img" height="200" image={project.image} alt={project.title} />
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold">{project.title}</Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.8)" sx={{ mt: 1 }}>
                      {project.description}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 2, background: "#21cbf3" }}
                      component={Link}
                      to={`/projects/${project.id}`}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call-to-Action Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}>
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Want to explore more?
          </Typography>
          <Button variant="contained" color="primary" component={Link} to="/projects">
            View All Projects
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default HomePage;
