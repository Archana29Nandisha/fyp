import React from "react";
import {
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
  Typography,
} from "@mui/material";
import {
  Home as HomeIcon,
  RateReview as ReviewIcon,
  Add as AddIcon,
  People as PeopleIcon,
  CheckCircle as ApproveIcon,
  List as ListIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { AccountCircle as ProfileIcon } from "@mui/icons-material";

const Sidebar = ({ role, handleTabChange, handleLogout }) => {
  const menuItems = [
    { label: "Home", icon: <HomeIcon />, role: "all" },
    { label: "Add Review", icon: <ReviewIcon />, role: "all" },
    { label: "Add Project", icon: <AddIcon />, role: "developer" },
    { label: "User Management", icon: <PeopleIcon />, role: "admin" },
    { label: "Approve Projects", icon: <ApproveIcon />, role: "admin" },
    { label: "Projects", icon: <ListIcon />, role: "admin" },
    { label: "Profile", icon: <ProfileIcon />, role: "all" },

  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 250,
          boxSizing: "border-box",
          background: "linear-gradient(135deg, #1e3c72, #2a5298, #6a11cb, #2575fc)",
          color: "#fff",
          borderRight: "2px solid rgba(255, 255, 255, 0.2)",
        },
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ textAlign: "center", width: "100%", fontWeight: "bold" }}
        >
          Dashboard
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map(
          (item) =>
            (item.role === "all" || role === item.role || role === "admin") && (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => handleTabChange(item.label)}
                  sx={{
                    color: "#fff",
                    "&:hover": { background: "rgba(255, 255, 255, 0.15)" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {item.icon}
                    <ListItemText primary={item.label} />
                  </Box>
                </ListItemButton>
              </ListItem>
            )
        )}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: "#fff",
              "&:hover": { background: "rgba(255, 255, 255, 0.15)" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LogoutIcon />
              <ListItemText primary="Logout" />
            </Box>
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
