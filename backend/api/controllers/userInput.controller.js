const mongoose = require('mongoose');
const Vendor = require('../../models/Vendor');
const {spawn, exec} = require('child_process');
const PythonShell = require('python-shell').PythonShell;



function isOneOf(value, validValues) {
    return validValues.includes(value);
  };


const parseAllVendors =  async (numOfPeopleOrHours) => {
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
    console.log(arrayFullOfFacts)
    return arrayFullOfFacts;
};
const parseInput = async (input) => {
    let inputInString = "(event (type " + input.type + ") (date " + input.date + ") (location " + input.location + ") (guest-capacity " + input.capacity + ") (budget " + input.cost + "))";
    return inputInString;
}

const ftbUserInput = async (req, res) => {
    const input = req.body;
    const categoriesByHP = ["Catering", "Entertainment"];
    let inputString;
    let vendorFacts;
    try {
        inputString = await parseInput(input);
    } catch (error) {
        console.error("Error parsing input:", error);
        return res.status(500).json({ 
            message: "Error processing input",
            error: error.message 
        });
    }

    
    if (isOneOf(input.type, categoriesByHP)) {
        vendorFacts = await parseAllVendors(input.num); 
    } else {
        vendorFacts = await parseAllVendors(0);
    }

    const options = {
        mode: 'text',
        scriptPath: 'backend/api/rule_engine/clipsScript.py',
        args: [inputString, vendorFacts]
    }
    const python = exec('python', ['./api/rule_engine/clipsScript.py', inputString, vendorFacts]);
    let pythonOutput = '';
    python.stdout.on('data', function(data) { 
        res.send(data.toString()); 
    } ) 
    console.log(pythonOutput);
    python.on('close', (code) => {
        if (code === 0) {
            try {
                const result = JSON.parse(pythonOutput);
                res.status(200).json({
                    message: "Success",
                    data: result 
                });
            } catch (error) {
                console.error("Error parsing Python output:", error);
                res.status(500).json({
                    message: "Error processing Python output",
                    error: error.message
                });
            }
        } else {
            console.error(`Python script exited with code ${code}`);
            res.status(500).json({
                message: "Python script error",
                error: `Python script exited with code ${code}`
            });
        }
    });
}

module.exports = ftbUserInput;

