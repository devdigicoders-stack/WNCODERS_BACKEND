const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    profileImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Method to match entered password with saved password
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return enteredPassword === this.password;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
