const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.route.js');
const authRouter = require('./routes/auth.route.js');

const app = express();
app.use(express.json());

let x = 3000;

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test')
.then(() => {
    console.log('Connected!');
    app.listen(x, () => {
        console.log('Server is running on port ' + x);
    });
});