import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

const ApproveProject = ({
  approvedProjects,
  pendingProjects,
  allProjects,
  handleApproveProject,
  handleDeleteProject,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [page, setPage] = useState(0); // Pagination page index
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    setPage(0); // Reset pagination on tab change
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleShowDetails = (project) => {
    setSelectedProject(project);
  };

  const handleCloseDialog = () => {
    setSelectedProject(null);
  };

  const renderTable = (projects) => (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((project) => (
                <TableRow key={project._id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
                    {tabIndex === 1 && ( // Pending Approval Tab
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleApproveProject(project._id)}
                      >
                        Approve
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteProject(project._id)}
                      sx={{ ml: 2 }}
                    >
                      Delete
                    </Button>
                    {tabIndex === 2 && ( // Show Details in All Projects Tab
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleShowDetails(project)}
                        sx={{ ml: 2 }}
                      >
                        Show
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={projects.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );

  return (
    <Box>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Approved Projects" />
        <Tab label="Pending Approval" />
        <Tab label="All Projects" />
      </Tabs>
      <Box sx={{ mt: 3 }}>
        {tabIndex === 0 && renderTable(approvedProjects)}
        {tabIndex === 1 && renderTable(pendingProjects)}
        {tabIndex === 2 && renderTable(allProjects)}
      </Box>

      {/* Dialog for Project Details */}
      {selectedProject && (
        <Dialog open onClose={handleCloseDialog}>
          <DialogTitle>Project Details</DialogTitle>
          <DialogContent>
            <Typography variant="h6">
              Project: {selectedProject.name}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Positive Reviews:{" "}
              {
                selectedProject.reviews.filter(
                  (review) => review.sentiment === "Positive"
                ).length
              }
            </Typography>
            <Typography variant="body1">
              Negative Reviews:{" "}
              {
                selectedProject.reviews.filter(
                  (review) => review.sentiment === "Negative"
                ).length
              }
            </Typography>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default ApproveProject;
