const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serName: {
        type: String,
        required: true
    },
    serUserID: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    serDescription: {
        type: String,
        required: true
    },
    serType: {
        type: String,
        // work on discriminator in the future
        enum: ["Venue", "Catering", "Beauty", "Entertainment", "Other"],
        required: true
    },
    serPrice: {
        type: Number,
        required: true
    },
    serPremium: {
        type: [premium],
        required: false
    }
});

const premium = new mongoose.Schema({
    upCharge: {
        type: Number,
        required: false
    },
    premDescription: {
        type: String,
        required: true
    },
    premName: {
        type: String,
        required: True
    },
});

module.exports = mongoose.model('Service', serviceSchema);