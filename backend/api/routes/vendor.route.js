const express = require('express');
const {getAllVendors, getVendorByID} = require('../controllers/vendor.controller');

const router = express.Router();

router.get('/', getAllVendors);
router.get('/:id', getVendorByID);

module.exports = router