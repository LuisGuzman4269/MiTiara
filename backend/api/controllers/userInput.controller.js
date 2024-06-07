const mongoose = require('mongoose');
const Vendor = require('../../models/Vendor');
const spawn = require('child_process');


function isOneOf(value, validValues) {
    return validValues.includes(value);
  };


const parseAllVendors = async (numOfPeopleOrHours) => {
    const vendors = await Vendor.find();
    const categoriesByHP = ["Catering", "Entertainment"];
    const categoriesByC = ["Catering", "Venue"];
    let arrayFullOfFacts = [];
    for (const vendor of vendors) {
        const dayString = vendor.vendorBio.vendorAvailability.map(dayObj => "\"" + dayObj.dayOfWeek + "\"").join(" ");
        for (const service of vendor.vendorServices) {
            let cost;
            let capacity;
            if (isOneOf(service.serType, categoriesByHP)) {
                cost = numOfPeopleOrHours * service.serPrice;
            } else {
                cost = service.serPrice;
            }

            if (isOneOf(service.serType, categoriesByC)) {
                capacity = service.serDetails.capacity;
            } else {
                capacity = 0;
            }

            fact = "(vendor " + "(id \"" + vendor._id +"\") " + "(name \"" + vendor.vendorName +"\") " + "(location \"" + vendor.vendorCity +"\") "
            + "(service-type \"" + service.serType +"\") " + "(availability " + dayString +") " +  "(capacity " + capacity +") " + "(cost " + cost +") "
            + "(customer-ratings " + vendor.vendorRating + "))";
            arrayFullOfFacts.push(fact);
        }
    }
    return arrayFullOfFacts;
};
const parseInput = async (input) => {
    let inputInString = "(event (type " + input.type + ") (date " + input.date + ") (location" + input.location + ") (capacity " + input.capacity + ") (budget " + input.cost + "))";
    return inputInString;
}

const ftbUserInput = async (req, res) => {
    const input = req.body;
    const categoriesByHP = ["Catering", "Entertainment"];
    try {
        const inputString = await parseInput(input);
    } catch (error) {
        console.error("Error parsing input:", error);
        return res.status(500).json({ 
            message: "Error processing input",
            error: error.message 
        });
    }

    if (isOneOf(input.type, categoriesByHP)) {
        const vendorFacts = parseAllVendors(input.num); 
    } else {
        const vendorFacts = parseAllVendors(0);
    }
    const python = spawn('python', ['../rule_engine/clipsScript.py', input, vendorFacts]);
    python.stdout.on('data',);
    res.status(200).json({
        message: "data received",
        data: input
    });
}

/*
mongoose.connect('mongodb://localhost:27017/PFM')
.then(() => {
    console.log('Connected to MongoDB!');
});
parseAllVendors(5);
*/

module.exports = ftbUserInput;

