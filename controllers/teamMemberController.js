const TeamMember = require('../models/TeamMember');

// @desc    Get all team members
// @route   GET /api/team-members
// @access  Public
const getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ createdAt: -1 });
    res.status(200).json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single team member
// @route   GET /api/team-members/:id
// @access  Public
const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (teamMember) {
      res.status(200).json(teamMember);
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a team member
// @route   POST /api/team-members
// @access  Private
const createTeamMember = async (req, res) => {
  try {
    const { name, role, description, imageUrl, category, status, socialLinks } = req.body;

    if (!name || !role || !description || !imageUrl || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const teamMember = await TeamMember.create({
      name,
      role,
      description,
      imageUrl,
      category,
      status,
      socialLinks,
    });

    res.status(201).json(teamMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a team member
// @route   PUT /api/team-members/:id
// @access  Private
const updateTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (teamMember) {
      teamMember.name = req.body.name || teamMember.name;
      teamMember.role = req.body.role || teamMember.role;
      teamMember.description = req.body.description || teamMember.description;
      teamMember.imageUrl = req.body.imageUrl || teamMember.imageUrl;
      teamMember.category = req.body.category || teamMember.category;
      teamMember.status = req.body.status || teamMember.status;
      
      if (req.body.socialLinks) {
        teamMember.socialLinks = {
          linkedin: req.body.socialLinks.linkedin !== undefined ? req.body.socialLinks.linkedin : teamMember.socialLinks.linkedin,
          twitter: req.body.socialLinks.twitter !== undefined ? req.body.socialLinks.twitter : teamMember.socialLinks.twitter,
          instagram: req.body.socialLinks.instagram !== undefined ? req.body.socialLinks.instagram : teamMember.socialLinks.instagram,
        };
      }

      const updatedTeamMember = await teamMember.save();
      res.status(200).json(updatedTeamMember);
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a team member
// @route   DELETE /api/team-members/:id
// @access  Private
const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (teamMember) {
      await teamMember.deleteOne();
      res.status(200).json({ message: 'Team member removed' });
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};
