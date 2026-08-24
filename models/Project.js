const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a project title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    projectLink: {
      type: String,
      required: [true, 'Please add a project link'],
    },
    technologies: {
      type: [String],
      required: [true, 'Please add at least one technology'],
    },
    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Pending'],
      default: 'In Progress',
    },
    category: {
      type: String,
      enum: ['Web Development', 'App Development', 'Other'],
      required: [true, 'Please add a category'],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
