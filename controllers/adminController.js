const Admin = require('../models/Admin');
const Consultation = require('../models/Consultation');
const Message = require('../models/Message');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const TeamMember = require('../models/TeamMember');
const generateToken = require('../utils/generateToken');

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if admin exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password,
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        profileImage: admin.profileImage,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate an admin (Login)
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin email
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        profileImage: admin.profileImage,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin profile (Protected Route Example)
// @route   GET /api/admin/profile
// @access  Private
const getAdminProfile = async (req, res) => {
  res.status(200).json(req.admin);
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private
const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (admin) {
      admin.name = req.body.name || admin.name;
      admin.email = req.body.email || admin.email;
      if (req.body.profileImage !== undefined) {
        admin.profileImage = req.body.profileImage;
      }
      if (req.body.password) {
        admin.password = req.body.password;
      }

      const updatedAdmin = await admin.save();

      res.json({
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        profileImage: updatedAdmin.profileImage,
        token: generateToken(updatedAdmin._id),
      });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change admin password
// @route   PUT /api/admin/change-password
// @access  Private
const changeAdminPassword = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (admin) {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide both current and new password' });
      }

      // Check if current password matches
      if (!(await admin.matchPassword(currentPassword))) {
        return res.status(401).json({ message: 'Incorrect current password' });
      }

      // Update password
      admin.password = newPassword;
      await admin.save();

      res.json({ message: 'Password changed successfully' });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const totalConsultations = await Consultation.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalTeamMembers = await TeamMember.countDocuments();

    const recentConsultations = await Consultation.find().sort({ createdAt: -1 }).limit(5);
    const recentProjects = await Project.find().sort({ createdAt: -1 }).limit(5);

    // Aggregate Project Statuses
    const completedProjects = await Project.countDocuments({ status: 'Completed' });
    const inProgressProjects = await Project.countDocuments({ status: 'In Progress' });
    const pendingProjects = await Project.countDocuments({ status: 'Pending' });

    res.json({
      totals: {
        enquiries: totalConsultations + totalMessages,
        projects: totalProjects,
        blogs: totalBlogs,
        teamMembers: totalTeamMembers,
      },
      projectStatusCounts: {
        completed: completedProjects,
        inProgress: inProgressProjects,
        pending: pendingProjects
      },
      recentEnquiries: recentConsultations,
      recentProjects: recentProjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getDashboardStats,
};
