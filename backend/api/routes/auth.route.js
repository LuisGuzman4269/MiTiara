const express = require('express');
const signup = require('../controllers/auth.contromoller.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
module.exports = router