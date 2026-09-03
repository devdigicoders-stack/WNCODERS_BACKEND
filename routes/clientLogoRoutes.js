const express = require('express');
const router = express.Router();
const { getClientLogos, addClientLogo, deleteClientLogo } = require('../controllers/clientLogoController');

router.route('/')
  .get(getClientLogos)
  .post(addClientLogo); // Typically this would be protected with a protect admin middleware

router.route('/:id')
  .delete(deleteClientLogo); // Typically protected as well

module.exports = router;
