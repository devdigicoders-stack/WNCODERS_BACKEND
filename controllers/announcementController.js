const Announcement = require('../models/Announcement');

// @desc    Get the current announcement
// @route   GET /api/announcements
// @access  Public
const getAnnouncement = async (req, res) => {
  try {
    // We only need one announcement, so we can just find the first one
    const announcement = await Announcement.findOne();
    
    if (announcement) {
      res.json(announcement);
    } else {
      // Return a default empty announcement if none exists
      res.json({ text: '', link: '', isActive: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update or create the announcement
// @route   PUT /api/announcements
// @access  Private (Admin)
const updateAnnouncement = async (req, res) => {
  try {
    const { text, link, isActive } = req.body;

    let announcement = await Announcement.findOne();

    if (announcement) {
      // Update existing
      announcement.text = text;
      if (link !== undefined) announcement.link = link;
      if (isActive !== undefined) announcement.isActive = isActive;
      
      const updatedAnnouncement = await announcement.save();
      res.json(updatedAnnouncement);
    } else {
      // Create new if doesn't exist
      const newAnnouncement = await Announcement.create({
        text,
        link,
        isActive
      });
      res.status(201).json(newAnnouncement);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getAnnouncement,
  updateAnnouncement,
};
