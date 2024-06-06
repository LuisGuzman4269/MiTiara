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

module.exports = mongoose.model('Service', serviceSchema);
