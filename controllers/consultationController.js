const Consultation = require('../models/Consultation');

// @desc    Create a new consultation request
// @route   POST /api/consultations
// @access  Public
const createConsultation = async (req, res) => {
  try {
    const { fullName, phoneNumber, message } = req.body;

    if (!fullName || !phoneNumber || !message) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const consultation = await Consultation.create({
      fullName,
      phoneNumber,
      message,
    });

    res.status(201).json(consultation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all consultations
// @route   GET /api/consultations
// @access  Private
const getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.status(200).json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single consultation
// @route   GET /api/consultations/:id
// @access  Private
const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (consultation) {
      res.status(200).json(consultation);
    } else {
      res.status(404).json({ message: 'Consultation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update consultation details/status
// @route   PUT /api/consultations/:id
// @access  Private
const updateConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (consultation) {
      consultation.fullName = req.body.fullName || consultation.fullName;
      consultation.phoneNumber = req.body.phoneNumber || consultation.phoneNumber;
      consultation.message = req.body.message || consultation.message;
      consultation.status = req.body.status || consultation.status;

      const updatedConsultation = await consultation.save();
      res.status(200).json(updatedConsultation);
    } else {
      res.status(404).json({ message: 'Consultation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete consultation
// @route   DELETE /api/consultations/:id
// @access  Private
const deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (consultation) {
      await consultation.deleteOne();
      res.status(200).json({ message: 'Consultation removed' });
    } else {
      res.status(404).json({ message: 'Consultation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultation,
  deleteConsultation,
};
