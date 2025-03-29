import React from "react";
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia } from "@mui/material";
import { motion } from "framer-motion";

const projects = [
  {
    id: 1,
    title: "AI-Based Review Analyzer",
    description: "An AI-powered system that analyzes customer reviews and provides sentiment insights.",
    image:"/images/freepik__aibased-review-analyzer__91652.jpg",
  },
  {
    id: 2,
    title: "Urban Development Feedback System",
    description: "A crowdsourced platform for urban planning feedback with NLP-based sentiment analysis.",
    image: "/images/freepik__the-style-is-candid-image-photography-with-natural__91653.jpeg",
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
          Welcome
        </Typography>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
        <Typography variant="h6" color="rgba(255, 255, 255, 0.8)" sx={{ mb: 4, maxWidth: 700 }}>
          We collect your valuable feedback to increase our projects.
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
        </Box>
      </motion.div>
    </Box>
  );
};

export default HomePage;
