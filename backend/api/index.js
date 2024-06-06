const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.route.js');
const authRouter = require('./routes/auth.route.js');
const vendorRouter = require('./routes/vendor.route.js');
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.json());
app.use(cookieParser);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test')
.then(() => {
    console.log('Connected!');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/vendors", vendorRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    return res.status(statucCode).json({
        success: false,
        status: statusCode,
        message
    });
});
