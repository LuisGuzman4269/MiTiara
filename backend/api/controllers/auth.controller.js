const User = require('../../models/User.js');
const bcryptjs = require('bcryptjs');


const signup = async (req, res, next) => {
    const {username, fname, lname, password, dateOfBirth, email} = req.body;
    const hashedPassword = bcrpytjs.hashsync(password, 10);
    const newUser = new User({username, fname, lname, password: hashedPassword, dateOfBirth: Date(dateOfBirth), email});
    try {
        await newUser.save();
        res.status(201).json('User created successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = signup;