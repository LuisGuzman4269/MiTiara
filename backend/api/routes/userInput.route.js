const express = require('express');
const ftbUserInput = require('../controllers/userInput.controller')

const router = express.Router();

router.post('/', ftbUserInput);

module.exports = router;