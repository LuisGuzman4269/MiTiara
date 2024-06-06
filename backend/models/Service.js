const mongoose = require('mongoose');

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
        required: true
    },
});

const serviceSchema = new mongoose.Schema({
    serName: {
        type: String,
        required: true
    },
    serDescription: {
        type: String,
        required: true
    },
    serImages: {
        type: [String],
        required: false
    },
    serType: {
        type: String,
        enum: ["Venue", "Catering", "Decoration", "Entertainment", "Photography"],
        required: true
    },
    serPrice: {
        type: Number,
        required: true
    },
    serByHour: {
        type: Boolean,
        required: true
    },
    serPremium: {
        type: [premium],
        required: false
    },
    serDetails: {
        type: mongoose.Schema.Types.Mixed,
        required: false 
    }
});


module.exports = serviceSchema;
