const User = require('../../models/User.js');
const bcryptjs = require('bcryptjs');
const errorHandler = require('../utils/errorHandler');
const jsw = require('jsonwebtoken');

const signup = async (req, res, next) => {
    const {username, fname, lname, password, dateOfBirth, email} = req.body;
    const hashedPassword = bcrpytjs.hashsync(password, 10);
    const newUser = new User({username, fname, lname, password: hashedPassword, dateOfBirth: Date(dateOfBirth), email});
    try {
        await newUser.save();
        res.status(201).json('User created successfully');
    } catch (error) {
        next(errorHandler(550, 'error from the function'));
    }
};

const login = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validUser =  await User.findOne({email});
        if(!validUser) {
            return next(errorHandler(404, 'User not found'));
        }
        const isPasswordValid = bcryptjs.compareSync(password, validUser.password);
        if(!isPasswordValid) {
            return next(errorHandler(401, 'Wrong credientials!'));
        }
        const token = jsw.sign({userId: validUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        const {password: pass, ...rest} = validUser.doc;
        res.cookie('access_token', token, {httpOnly: true});
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}

module.exports = signup;
module.exports = login;