const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// Routers
const userRouter = require('./routes/user.route.js');
const authRouter = require('./routes/auth.route.js');
const vendorRouter = require('./routes/vendor.route.js');
const getInputRouter = require('./routes/userInput.route.js');

const app = express();

// Middleware
app.use(express.json());

app.use(cookieParser());

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/vendors", vendorRouter);
app.use("/api/sendData", getInputRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    return res.status(statusCode).json({
        success: false,
        status: statusCode,
        message
    });
});

// Connect to MongoDB and start the server
mongoose.connect('mongodb://localhost:27017/PFM')
.then(() => {
    console.log('Connected to MongoDB!');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch(error => {
    console.error('Error connecting to MongoDB:', error); 
});
