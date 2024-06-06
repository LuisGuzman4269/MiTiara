const mongoose = require('mongoose');
const User = require('../../models/User');
const Vendor = require('../../models/Vendor');
const Service = require('../../models/Service');
// Connect to your MongoDB database
mongoose.connect('mongodb://localhost:27017/PFM')
.then(() => {
    console.log('Connected to MongoDB!');
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

const sampleVenueVendors = [
    {
        //Venue 1 
        vendorName: "Region Events",
        vendorCity: "San Luis Obispo",
        vendorState: "California",
        vendorBio: {
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
    },
    {
    //Venue 2 
    vendorName: "Elks Lodge",
    vendorCity: "San Luis Obispo",
    vendorState: "California",
    vendorBio: {
      bioDescription: "Traditional venue ideal for large gatherings and events.",
      bioImages: [
        "https://lh3.googleusercontent.com/p/AF1QipO7hEKT5psUJMLZX0Xx6EpzHFmGty3N4w6NEdUe=s1360-w1360-h1020"
      ],
      vendorAvailability: [
        { dayOfWeek: "Saturday", startTime: new Date("1970-01-01T10:00"), endTime: new Date("1970-01-01T22:00") },
        { dayOfWeek: "Sunday", startTime: new Date("1970-01-01T10:00"), endTime: new Date("1970-01-01T22:00") }
      ]
    },
    vendorCategories: ["Venue"],
    vendorServices: [{
      serName: "Banquet Hall Rental",
      serDescription: "Large banquet hall for weddings, quinceañeras, and parties.",
      serImages: ["https://lh3.googleusercontent.com/p/AF1QipOHLOoW5v1rwobAfGs2r0Q0vFRZQ6IgD8Nkc7EB=s1360-w1360-h1020"],
      serType: "Venue",
      serPrice: 3000,
      serByHour: false,
      serPremium: [
        {
          upCharge: 300,
          premDescription: "Use of kitchen facilities",
          premName: "Kitchen Access"
        }
      ],
      serDetails: {
        capacity: 300,
        amenities: ["Full kitchen", "Parking", "Stage"]
      }
    }]
  },
  
  {
    //Venue 3 
    vendorName: "Avila Beach Resort",
    vendorCity: "Avila Beach",
    vendorState: "California",
    vendorBio: {
      bioDescription: "Beautiful beachfront venue perfect for weddings and large gatherings.",
      bioImages: [
        "https://lh3.googleusercontent.com/p/AF1QipPcQOi3z-4J6JZz7FZMcWp2nZXTiM8PFDvO1C9E=s1360-w1360-h1020"
      ],
      vendorAvailability: [
        { dayOfWeek: "Friday", startTime: new Date("1970-01-01T11:00"), endTime: new Date("1970-01-01T23:00") },
        { dayOfWeek: "Saturday", startTime: new Date("1970-01-01T11:00"), endTime: new Date("1970-01-01T23:00") }
      ]
    },
    vendorCategories: ["Venue"],
    vendorServices: [{
      serName: "Beachfront Event Space",
      serDescription: "Scenic outdoor space for beachfront events.",
      serImages: ["https://lh3.googleusercontent.com/p/AF1QipNjQj1oxZwRWbMBn5KdJe2mrxE9A5--O-UNno9B=s1360-w1360-h1020"],
      serType: "Venue",
      serPrice: 7000,
      serByHour: false,
      serPremium: [
        {
          upCharge: 700,
          premDescription: "Private cabana setup",
          premName: "Cabana Access"
        }
      ],
      serDetails: {
        capacity: 250,
        amenities: ["Ocean view", "Outdoor seating", "Sound system"]
      }
    }]
  },
  {
    //Venue 4
    vendorName: "SLO Brew Rock",
    vendorCity: "San Luis Obispo",
    vendorState: "California",
    vendorBio: {
      bioDescription: "Trendy venue for concerts, parties, and corporate events.",
      bioImages: [
        "https://lh3.googleusercontent.com/p/AF1QipPY6sP98P2Pki0lJjo4VxSzJMYlP6wtoUlZn12C=s1360-w1360-h1020"
      ],
      vendorAvailability: [
        { dayOfWeek: "Thursday", startTime: new Date("1970-01-01T17:00"), endTime: new Date("1970-01-01T23:00") },
        { dayOfWeek: "Friday", startTime: new Date("1970-01-01T17:00"), endTime: new Date("1970-01-01T23:00") },
        { dayOfWeek: "Saturday", startTime: new Date("1970-01-01T14:00"), endTime: new Date("1970-01-01T23:00") }
      ]
    },
    vendorCategories: ["Venue"],
    vendorServices: [{
      serName: "Concert Hall Rental",
      serDescription: "Spacious concert hall with state-of-the-art sound system.",
      serImages: ["https://lh3.googleusercontent.com/p/AF1QipPN2kqQWxiMstK_AtIbAfEdgybi5UI5MJ6M6v5Z=s1360-w1360-h1020"],
      serType: "Venue",
      serPrice: 4000,
      serByHour: false,
      serPremium: [
        {
          upCharge: 400,
          premDescription: "VIP lounge access",
          premName: "Lounge Access"
        }
      ],
      serDetails: {
        capacity: 400,
        amenities: ["Stage", "Sound system", "Lighting"]
      }
    }]
  },
];

const sampleEntertainmentVendors = [
    {
    // Entertainment 1
    vendorName: "Mariachi San Luis",
    vendorCity: "San Luis Obispo",
    vendorState: "California",
    vendorBio: {
      bioDescription: "Authentic Mariachi band for weddings, quinceañeras, and parties.",
      bioImages: [
        "https://lh3.googleusercontent.com/p/AF1QipO72Qmc_M3uyv-Dh-8WV7bEsmn63Gq1-4l72sQA=s1360-w1360-h1020"
      ],
      vendorAvailability: [
        { dayOfWeek: "Friday", startTime: new Date("1970-01-01T18:00"), endTime: new Date("1970-01-01T23:00") },
        { dayOfWeek: "Saturday", startTime: new Date("1970-01-01T18:00"), endTime: new Date("1970-01-01T23:00") },
        { dayOfWeek: "Sunday", startTime: new Date("1970-01-01T12:00"), endTime: new Date("1970-01-01T23:00") }
      ]
    },
    vendorCategories: ["Entertainment"],
    vendorServices: [{
      serName: "Mariachi Performance",
      serDescription: "Traditional Mariachi music for all types of events.",
      serImages: ["https://lh3.googleusercontent.com/p/AF1QipO72Qmc_M3uyv-Dh-8WV7bEsmn63Gq1-4l72sQA=s1360-w1360-h1020"],
      serType: "Entertainment",
      serPrice: 200,
      serByHour: true,
      serPremium: [
        {
          upCharge: 50,
          premDescription: "Extended performance time",
          premName: "Extra Hour"
        }
      ],
      serDetails: {
        numberOfPerformers: 7,
        instruments: ["Guitar", "Violin", "Trumpet"]
      }
    }]
  },

  {
    //Entertainment 2
    vendorName: "DJ Kramer",
    vendorCity: "Santa Maria",
    vendorState: "California",
    vendorBio: {
      bioDescription: "Professional DJ service for weddings, parties, and corporate events.",
      bioImages: [
        "https://example.com/dj-kramer.jpg"
      ],
      vendorAvailability: [
        { dayOfWeek: "Friday", startTime: new Date("1970-01-01T18:00"), endTime: new Date("1970-01-01T23:00") },
        { dayOfWeek: "Saturday", startTime: new Date("1970-01-01T18:00"), endTime: new Date("1970-01-01T23:00") },
        { dayOfWeek: "Sunday", startTime: new Date("1970-01-01T12:00"), endTime: new Date("1970-01-01T23:00") }
      ]
    },
    vendorCategories: ["Entertainment"],
    vendorServices: [{
      serName: "DJ Services",
      serDescription: "High-energy DJ for all types of events, specializing in Latin music.",
      serImages: ["https://example.com/dj-services.jpg"],
      serType: "Entertainment",
      serPrice: 275,
      serByHour: true,
      serPremium: [
        {
          upCharge: 30,
          premDescription: "Custom playlist creation",
          premName: "Custom Playlist"
        }
      ],
      serDetails: {
        equipment: ["Speakers", "Lights", "Turntables"],
        musicGenres: ["Latin", "Top 40", "Hip Hop"]
      }
    }]
  },

  {
    //Entertainment 3
    vendorName: "The Wavebreakers Band",
    vendorCity: "Paso Robles",
    vendorState: "California",
    vendorBio: {
      bioDescription: "Live band for an authentic and lively event experience.",
      bioImages: [
        "https://example.com/wavebreakers-band.jpg"
      ],
      vendorAvailability: [
        { dayOfWeek: "Saturday", startTime: new Date("1970-01-01T14:00"), endTime: new Date("1970-01-01T22:00") },
        { dayOfWeek: "Sunday", startTime: new Date("1970-01-01T14:00"), endTime: new Date("1970-01-01T22:00") }
      ]
    },
    vendorCategories: ["Entertainment"],
    vendorServices: [{
      serName: "Live Band Performance",
      serDescription: "Lively performances by a professional Latin band.",
      serImages: ["https://example.com/live-band-performance.jpg"],
      serType: "Entertainment",
      serPrice: 350,
      serByHour: true,
      serPremium: [
        {
          upCharge: 75,
          premDescription: "Extended performance time",
          premName: "Extra Hour"
        }
      ],
      serDetails: {
        numberOfPerformers: 6,
        instruments: ["Guitar", "Trumpet", "Percussion"]
      }
    }]
  },

  {
    //Entertainment 4
    vendorName: "Fresno Rodeo",
    vendorCity: "San Luis Obispo",
    vendorState: "California",
    vendorBio: {
      bioDescription: "Exciting mechanical bull rental for a thrilling event experience.",
      bioImages: [
        "https://example.com/fresno-rodeo.jpg"
      ],
      vendorAvailability: [
        { dayOfWeek: "Friday", startTime: new Date("1970-01-01T18:00"), endTime: new Date("1970-01-01T23:00") },
        { dayOfWeek: "Saturday", startTime: new Date("1970-01-01T18:00"), endTime: new Date("1970-01-01T23:00") },
        { dayOfWeek: "Sunday", startTime: new Date("1970-01-01T12:00"), endTime: new Date("1970-01-01T23:00") }
      ]
    },
    vendorCategories: ["Entertainment"],
    vendorServices: [{
      serName: "Mechanical Bull Rental",
      serDescription: "Rent a mechanical bull for an unforgettable event.",
      serImages: ["https://example.com/mechanical-bull.jpg"],
      serType: "Entertainment",
      serPrice: 200,
      serByHour: true,
      serPremium: [
        {
          upCharge: 50,
          premDescription: "Extended rental time",
          premName: "Extra Hour"
        }
      ],
      serDetails: {
        safetyFeatures: ["Soft landing area", "Speed control"]
      }
    }]
  }, 

  {
    //Entertainment 5
    vendorName: "SLO Bounce Co",
    vendorCity: "Templeton",
    vendorState: "California",
    vendorBio: {
      bioDescription: "Bounce house and inflatable rentals for kids' parties.",
      bioImages: [
        "https://example.com/slo-bounce.jpg"
      ],
      vendorAvailability: [
        { dayOfWeek: "Friday", startTime: new Date("1970-01-01T18:00"), endTime: new Date("1970-01-01T23:00") },
        { dayOfWeek: "Saturday", startTime: new Date("1970-01-01T18:00"), endTime: new Date("1970-01-01T23:00") },
        { dayOfWeek: "Sunday", startTime: new Date("1970-01-01T12:00"), endTime: new Date("1970-01-01T23:00") }
      ]
    },
    vendorCategories: ["Entertainment"],
    vendorServices: [{
      serName: "Bounce House Rental",
      serDescription: "Fun and safe bounce houses for children's events.",
      serImages: ["https://example.com/bounce-house.jpg"],
      serType: "Entertainment",
      serPrice: 150,
      serByHour: true,
      serPremium: [
        {
          upCharge: 30,
          premDescription: "Extended rental time",
          premName: "Extra Hour"
        }
      ],
      serDetails: {
        safetyFeatures: ["Safety netting", "Soft landing area"]
      }
    }]
  }
];

const sampleCateringVendors = [
    {
      //Catering 1
      vendorName: "Taqueria 805",
      vendorCity: "San Luis Obispo",
      vendorState: "California",
      vendorBio: {
        bioDescription: "Authentic Mexican catering for weddings, quinceañeras, and parties.",
        bioImages: [
          "https://example.com/taqueria-805.jpg"
        ],
        vendorAvailability: [
          { dayOfWeek: "Friday", startTime: new Date("1970-01-01T11:00"), endTime: new Date("1970-01-01T23:00") },
          { dayOfWeek: "Saturday", startTime: new Date("1970-01-01T11:00"), endTime: new Date("1970-01-01T23:00") },
          { dayOfWeek: "Sunday", startTime: new Date("1970-01-01T11:00"), endTime: new Date("1970-01-01T23:00") }
        ]
      },
      vendorCategories: ["Catering"],
      vendorServices: [{
        serName: "Taco Catering",
        serDescription: "Delicious taco catering with a variety of meats and toppings.",
        serImages: ["https://example.com/taco-catering.jpg"],
        serType: "Catering",
        serPrice: 12,
        serByHour: false,
        serPremium: [
          {
            upCharge: 3,
            premDescription: "Guacamole and sour cream",
            premName: "Extras"
          }
        ],
        serDetails: {
          cuisineType: "Mexican",
          servingSize: "Per person"
        }
      }]
    },
    {
      //Catering 2
      vendorName: "Popolo Catering",
      vendorCity: "Santa Maria",
      vendorState: "California",
      vendorBio: {
        bioDescription: "Full-service catering for any occasion, specializing in BBQ and Italian cuisine.",
        bioImages: [
          "https://example.com/popolo-catering.jpg"
        ],
        vendorAvailability: [
          { dayOfWeek: "Friday", startTime: new Date("1970-01-01T11:00"), endTime: new Date("1970-01-01T23:00") },
          { dayOfWeek: "Saturday", startTime: new Date("1970-01-01T11:00"), endTime: new Date("1970-01-01T23:00") },
          { dayOfWeek: "Sunday", startTime: new Date("1970-01-01T11:00"), endTime: new Date("1970-01-01T23:00") }
        ]
      },
      vendorCategories: ["Catering"],
      vendorServices: [{
        serName: "Full-Service Catering",
        serDescription: "BBQ and Italian cuisine catering with complete service.",
        serImages: ["https://example.com/full-service-catering.jpg"],
        serType: "Catering",
        serPrice: 25,
        serByHour: false,
        serPremium: [
          {
            upCharge: 5,
            premDescription: "Specialty desserts",
            premName: "Desserts"
          }
        ],
        serDetails: {
          cuisineType: "BBQ, Italian",
          servingSize: "Per person"
        }
      }]
    },
    {
      //Catering 3
      vendorName: "SLO Bartenders",
      vendorCity: "San Luis Obispo",
      vendorState: "California",
      vendorBio: {
        bioDescription: "Professional bartending services for any event.",
        bioImages: [
          "https://example.com/slo-bartenders.jpg"
        ],
        vendorAvailability: [
          { dayOfWeek: "Friday", startTime: new Date("1970-01-01T17:00"), endTime: new Date("1970-01-01T23:00") },
          { dayOfWeek: "Saturday", startTime: new Date("1970-01-01T17:00"), endTime: new Date("1970-01-01T23:00") },
          { dayOfWeek: "Sunday", startTime: new Date("1970-01-01T12:00"), endTime: new Date("1970-01-01T23:00") }
        ]
      },
      vendorCategories: ["Catering"],
      vendorServices: [{
        serName: "Bartending Service",
        serDescription: "Expert bartenders for weddings, parties, and corporate events.",
        serImages: ["https://example.com/bartending-service.jpg"],
        serType: "Catering",
        serPrice: 50,
        serByHour: true,
        serPremium: [
          {
            upCharge: 10,
            premDescription: "Custom cocktail menu",
            premName: "Custom Cocktails"
          }
        ],
        serDetails: {
          serviceType: "Bartending",
          servingSize: "Per hour"
        }
      }]
    },
    {
      //Catering 4
      vendorName: "Central Coast Catering",
      vendorCity: "Arroyo Grande",
      vendorState: "California",
      vendorBio: {
        bioDescription: "Gourmet catering services for any event, specializing in farm-to-table cuisine.",
        bioImages: [
          "https://example.com/central-coast-catering.jpg"
        ],
        vendorAvailability: [
          { dayOfWeek: "Friday", startTime: new Date("1970-01-01T11:00"), endTime: new Date("1970-01-01T23:00") },
          { dayOfWeek: "Saturday", startTime: new Date("1970-01-01T11:00"), endTime: new Date("1970-01-01T23:00") },
          { dayOfWeek: "Sunday", startTime: new Date("1970-01-01T11:00"), endTime: new Date("1970-01-01T23:00") }
        ]
      },
      vendorCategories: ["Catering"],
      vendorServices: [{
        serName: "Farm-to-Table Catering",
        serDescription: "Organic and locally sourced catering services.",
        serImages: ["https://example.com/farm-to-table-catering.jpg"],
        serType: "Catering",
        serPrice: 30,
        serByHour: false,
        serPremium: [
          {
            upCharge: 5,
            premDescription: "Organic dessert selection",
            premName: "Organic Desserts"
          }
        ],
        serDetails: {
          cuisineType: "Farm-to-table",
          servingSize: "Per person"
        }
      }]
    }
  ];

// Function to seed the database
async function seedDatabase() {
    try {
        await Vendor.deleteMany({}); 
        await Vendor.insertMany(sampleVenueVendors);
        await Vendor.insertMany(sampleEntertainmentVendors);
        await Vendor.insertMany(sampleCateringVendors);
        await User.deleteMany({});

        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        mongoose.disconnect();
    }
}

seedDatabase();