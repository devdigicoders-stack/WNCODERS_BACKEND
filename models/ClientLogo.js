const mongoose = require('mongoose');

const clientLogoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a client name'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ClientLogo', clientLogoSchema);
