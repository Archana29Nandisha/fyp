import { spawn } from 'child_process';
import Project from '../models/Project.js';
import multer from "multer";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/uploads/"); // Ensure 'uploads' folder exists in root directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }); // Now `storage` is properly defined

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
    const { name, description, location ,mapLocation} = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Store image path

    // Validate required fields
    if (!name || !description || !location || !image || !mapLocation) {
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
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const cleanedmapLocation = mapLocation.replace(/\sstyle=(["']).*?\1/gi, '');

    // Create the new project
    const project = new Project({
      name,
      description,
      location,
      image: imageUrl,
      mapLocation:cleanedmapLocation,
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

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the project has an associated image
    if (project.image) {
      const imagePath = path.join(__dirname, '../', project.image);

      // Delete the image from the server
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error("Error deleting image:", err);
        }
      });
    }

    // Delete the project from the database
    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ message: 'Project and associated image deleted successfully' });

  } catch (err) {
    console.error("Error deleting project:", err);
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

export const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 5, location } = req.query;

    const query = {}; // Fetch all projects (approved and pending)
    if (location) {
      query.location = location;
    }

    // Count total approved and pending projects
    const totalApproved = await Project.countDocuments({ ...query, approved: true });
    const totalPending = await Project.countDocuments({ ...query, approved: false });

    // ✅ Fetch all approved projects (NO PAGINATION)
    const approvedProjects = await Project.find({ ...query, approved: true })
      .populate("developer", "username")
      .sort({ createdAt: -1 });

    // ✅ Fetch paginated pending projects
    const pendingProjects = await Project.find({ ...query, approved: false })
      .populate("developer", "username")
      .skip((page - 1) * limit) // Pagination Logic
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      approvedProjects, // ✅ Shows all approved projects
      pendingProjects, // ✅ Shows paginated pending projects
      totalPendingPages: Math.ceil(totalPending / limit),
      currentPendingPage: parseInt(page),
      totalApproved,
      totalPending,
    });
  }catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getfullProjects = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
  
    // Count total projects
    const totalProjects = await Project.countDocuments();
  
    // Fetch projects with pagination
    const projects = await Project.find()
      .populate("developer", "username")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
  
    res.status(200).json({
      projects,
      totalPages: Math.ceil(totalProjects / limit),
      currentPage: parseInt(page),
      totalProjects,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
