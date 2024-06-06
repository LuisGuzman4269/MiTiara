const mongoose = require('mongoose');
const Service = require('./Service');

const VendorSchema = new mongoose.Schema(
    {
        vendorName: {
            type: String,
            required: true
        },
        vendorUser:
        {
            type: mongoose.SchemaTypes.ObjectId,
            // false because I am plugging in a fake user
            required: false 
        },
        vendorCity: {
            type: String,
            required: true
        },
        vendorState: {
            type: String,
            required: true
        },
        vendorBio: {
            type: bio,
            required: false
        },
        vendorCertificate: {
            type: certificate,
            required: false
        },
        vendorCategories: {
            type: [String],
            required: false
        },
        vendorServices: [{
            type: Service.Schema,
            required: false
        }]
    }
);

const bio = mongoose.Schema({
    bioDescription: {
        type: String,
    },
    bioImages: [{
        type: String,
        required: false,
    }],
    vendorAvailability: {
        type: [scheduleDay],
        required: true
    }
});

const scheduleDay = mongoose.Schema({
    dayOfWeek : {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
})

const certificate = mongoose.Schema({
    certName: {
        type: String,
        required: true
    },
    certDescription: {
        type: String,
        required: true
    },
    certImage: {
        type: Image,
        required: false
    }
})

module.exports = mongoose.model('Vendor', VendorSchema);
