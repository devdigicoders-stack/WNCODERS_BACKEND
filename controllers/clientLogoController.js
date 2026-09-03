const ClientLogo = require('../models/ClientLogo');
const path = require('path');
const fs = require('fs');

// @desc    Get all client logos
// @route   GET /api/client-logos
// @access  Public
const getClientLogos = async (req, res) => {
  try {
    const logos = await ClientLogo.find().sort({ createdAt: -1 });
    res.status(200).json(logos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a client logo
// @route   POST /api/client-logos
// @access  Private/Admin
const addClientLogo = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    if (!name || !imageUrl) {
      return res.status(400).json({ message: 'Please provide name and image URL' });
    }

    const clientLogo = await ClientLogo.create({
      name,
      imageUrl,
    });

    res.status(201).json(clientLogo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete client logo
// @route   DELETE /api/client-logos/:id
// @access  Private/Admin
const deleteClientLogo = async (req, res) => {
  try {
    const clientLogo = await ClientLogo.findById(req.params.id);

    if (!clientLogo) {
      return res.status(404).json({ message: 'Client logo not found' });
    }

    // Attempt to delete image file if it's stored locally
    if (clientLogo.imageUrl && clientLogo.imageUrl.startsWith('/uploads')) {
      const filePath = path.join(__dirname, '..', clientLogo.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await ClientLogo.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Client logo removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getClientLogos,
  addClientLogo,
  deleteClientLogo,
};
