const mongoose = require('mongoose');
const Vendor = require('../../models/Vendor');

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
            + "(customer-ratings " + vendor.vendorRating + ")";
            arrayFullOfFacts.push(fact);
        }
    }
    console.log(arrayFullOfFacts);
};

mongoose.connect('mongodb://localhost:27017/PFM')
.then(() => {
    console.log('Connected to MongoDB!');
});
parseAllVendors(5);

const ftbUserInput = async (req, res) => {
    const input = req.body;

    res.status(200).json(
        {message: "data recieved",
        data: input});
}

module.exports = ftbUserInput;


