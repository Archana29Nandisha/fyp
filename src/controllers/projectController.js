import { spawn } from 'child_process';
import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addProject = async (req, res) => {
  try {
    const { name } = req.body;
    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      return res.status(400).json({ message: 'Project already exists' });
    }
    const project = new Project({ name });
    await project.save();
    res.status(201).json({ message: 'Project added successfully', project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
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
    const { projectId, review } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const pythonProcess = spawn('python', ['src/controllers/python/script.py', review]);

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
      project.reviews.push({ user: req.user.id, content: review, sentiment: mlOutput.trim() });
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
