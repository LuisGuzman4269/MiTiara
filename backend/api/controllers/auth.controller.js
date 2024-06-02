const User = require('../../models/User.js');

const dateOfBirth = new Date(2019, 5, 3);
const signup = async (req, res) => {
    const {username, fname, lname, password, dateOfBiddrth, email} = req.body;
    const newUser = new User({username, fname, lname, password, dateOfBirth, email});
    await newUser.save();
    res.status(201).json({message: "User created successfuly"});
}

module.exports = signup;