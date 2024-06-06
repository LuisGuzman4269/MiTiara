const mongoose = require('mongoose');
const Service = require('../../models/Service');
const Vendor = require('../../models/Vendor');
const User = require('../../models/User')

// Connect to your MongoDB database
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

// Fake user that will be the user behind every vendor
const sampleUser = {
    username: "tempUser",
    fname: "John",
    lname: "Doe",
    password: "521",
    dateOfBirth: Date(1990, 0, 1),
    email: "temp@gmail.com",
    userImage: "https://static.wikia.nocookie.net/minecraft/images/f/fe/GrassNew.png/revision/latest/scale-to-width/360?cb=20190903234415"
}

const sampleVendors = [
    {
        vendorName: "Region Events",
        vendorCity: "San Luis Obispo",
        vendorState: "California",
        venderBio: {
            bioDescription: "Venue for big Events",
            bioImages: ["https://lh3.googleusercontent.com/p/AF1QipNXKDkfhPZbzLTP19Pid7kRflNCMSU-6uNkLFdA=s1360-w1360-h1020", "https://lh3.googleusercontent.com/p/AF1QipNZkiVUBYks207st11kkHN48nuPqkh3mmzm6yB7=s1360-w1360-h1020"],
        vendorAvailability: 
            [{
                dayOfWeek: "Monday",
                startTime: new Date("1970-01-01T09:00"), 
                endTime: new Date("1970-01-01T17:00") 
            },
            {
                dayOfWeek: "Tuesday",
                startTime: new Date("1970-01-01T09:00"), 
                endTime: new Date("1970-01-01T17:00") 
            },
            {
                dayOfWeek: "Wednesday",
                startTime: new Date("1970-01-01T09:00"), 
                endTime: new Date("1970-01-01T17:00") 
            },
            {
                dayOfWeek: "Thursday",
                startTime: new Date("1970-01-01T09:00"), 
                endTime: new Date("1970-01-01T17:00") 
            },
            {
                dayOfWeek: "Friday",
                startTime: new Date("1970-01-01T09:00"), 
                endTime: new Date("1970-01-01T17:00") 
            }]
        },
        vendorCategories: ["Venue"],
        vendorServices: [{
            serName: "Venue Access",
            serDescription: "A spacious and elegant venue for casual and corporate events.",
            serImages: ["https://lh3.googleusercontent.com/p/AF1QipM5Fiwp9DZGkdA6idiijPvJc07xS9UlDk0wNuoP=s1360-w1360-h1020"],
            serType: "Venue",
            serPrice: 5000,
            serByHour: false,
            serPremium: [
                {
                    upCharge: 500,
                    premDescription: "Exclusive use of outdoor patio",
                    premName: "Patio Access"
                }
            ],
            serDetails: {
                capacity: 500,
                amenities: ["Dance floor", "Stage", "Audiovisual equipment"]
            }
        }]
    }
]

// Function to seed the database
async function seedDatabase() {
    try {
        await Vendor.deleteMany({}); 
        await Vendor.insertMany(sampleServices);
        await User.deleteMany({});

        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        mongoose.disconnect();
    }
}
