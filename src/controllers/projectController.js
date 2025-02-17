import { spawn } from 'child_process';
import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const { page = 1, limit = 5, location } = req.query;
    const filter = { approved: true }; // Base filter

    // Add location filter if provided
    if (location) filter.location = location;

    // Convert to numbers
    const numericLimit = Number(limit);
    const numericPage = Number(page);

    // Fetch paginated projects
    const projects = await Project.find(filter)
      .populate('developer', 'username') // Include developer name
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit);

    // Get total count for pagination
    const total = await Project.countDocuments(filter);

    res.status(200).json({
      projects,
      totalPages: Math.ceil(total / numericLimit),
      currentPage: numericPage,
      totalResults: total
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getProjectByID = async (req,res)=>{
  try {
    const projectId = req.params.projectId;
    const { page = 1, limit = 5 } = req.query; // Pagination parameters
    const numericLimit = Number(limit);
    const numericPage = Number(page);

    // Fetch the project and populate developer details
    const project = await Project.findById(projectId)
      .populate("developer", "username") // Populate developer details
      .populate("reviews.user", "username"); // Populate user details for reviews

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Paginate the embedded reviews array
    const startIndex = (numericPage - 1) * numericLimit;
    const endIndex = numericPage * numericLimit;
    const paginatedReviews = project.reviews.slice(startIndex, endIndex);

    // Get total number of reviews for pagination
    const totalReviews = project.reviews.length;

    // Calculate total positive and negative reviews
    const positiveCount = project.reviews.filter(
      (review) => review.sentiment === "Positive"
    ).length;
    const negativeCount = project.reviews.filter(
      (review) => review.sentiment === "Negative"
    ).length;

    // Return the project details with paginated reviews and total counts
    res.status(200).json({
      project: {
        ...project.toObject(), // Convert Mongoose document to plain object
        reviews: paginatedReviews, // Add paginated reviews
      },
      totalPages: Math.ceil(totalReviews / numericLimit), // Total pages for reviews
      currentPage: numericPage, // Current page number
      positiveCount, // Total positive reviews
      negativeCount, // Total negative reviews
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addProject = async (req, res) => {
  try {
    const { name, description, location } = req.body;

    // Validate required fields
    if (!name || !description || !location) {
      return res.status(400).json({ message: "All fields are required: name, description, location" });
    }

    // Check if project name already exists
    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      return res.status(400).json({ message: "Project with this name already exists" });
    }

    // Validate location (must be one of the Sri Lankan districts)
    const districts = [
      "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale",
      "Nuwara Eliya", "Galle", "Matara", "Hambantota", "Jaffna",
      "Mannar", "Vavuniya", "Mullaitivu", "Kilinochchi", "Batticaloa",
      "Ampara", "Trincomalee", "Kurunegala", "Puttalam", "Anuradhapura",
      "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle",
    ];

    if (!districts.includes(location)) {
      return res.status(400).json({ message: "Invalid location. Must be one of the Sri Lankan districts." });
    }

    // Get the authenticated user's ID (assuming it's stored in req.user)
    const developer = req.user.id;

    // Create the new project
    const project = new Project({
      name,
      description,
      location,
      developer, // Associate the project with the authenticated user
      approved: false, // Default to false for new projects
      reviews: [], // Initialize with an empty reviews array
    });

    // Save the project to the database
    await project.save();

    // Return success response
    res.status(201).json({
      message: "Project added successfully",
      project: {
        _id: project._id,
        name: project.name,
        description: project.description,
        location: project.location,
        developer: project.developer,
        approved: project.approved,
        createdAt: project.createdAt,
      },
    });
  } catch (err) {
    console.error("Error adding project:", err);

    // Handle Mongoose validation errors
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: err.message });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ message: "Project name must be unique" });
    }

    // Generic server error
    res.status(500).json({ message: "Internal server error" });
  }
};
export const approveProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    project.approved = true;
    await project.save();
    res.status(200).json({ message: 'Project approved successfully', project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addReview = async (req, res) => {
  try {
    const { projectId, content } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const pythonProcess = spawn('python', ['src/controllers/python/script.py', content]);

    let mlOutput = '';
    pythonProcess.stdout.on('data', (data) => {
      mlOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error('Python error:', data.toString());
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        return res.status(500).json({ message: 'Failed to analyze sentiment' });
      }
      project.reviews.push({ user: req.user.id, content: content, sentiment: mlOutput.trim() });
      await project.save();
      res.status(200).json({ message: 'Review added successfully', project });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await Project.findByIdAndDelete(projectId);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getUser=async(req,res)=>{
  try{
    const projectId = req.params.id;
    const project = await Project.findById(projectId)
    .populate("developer", "name email"); // Populate developer name and email
    console.log(project)
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
