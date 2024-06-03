const bcryptjs = require('bcryptjs');
const User = require('../../models/User.js');
const errorHandler = require('../utils/error.js');

const test = (req, res) => {
    res.json({
        message: 'Hello World'
    });
};

const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return res.status(401).json('You can update only your account!');
    }
    try {
        if (req.body.password) {
            req.body.password = await bcryptjs.hash(req.body.password, 10);
        }
        
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                fname: req.body.fname,
                lname: req.body.lname,
                userImage: req.body.userImage
            }
        }, {new: true});
        const {password: pass, ...rest} = updatedUser._doc;

        res.status(200).json(rest);
    } catch(error) {
        next(error);
    }
}
module.exports = test;
module.exports = updateUser;