const mongoose = require('mongoose');

const ftbUserInput = async (req, res) => {
    const input = req.body;

    // write code here to do python clips stuff

    // send back some data indicating the best match    
    res.status(200).json(
        {message: "data recieved",
        data: input});
}

module.exports = ftbUserInput;

