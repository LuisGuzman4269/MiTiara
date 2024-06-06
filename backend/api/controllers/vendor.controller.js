const mongoose = require('mongoose');

const getAllVendors = async (req, res) => {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
}

const getVendorByID = async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Vendor not found' });
    }
    
    const vendor = await Vendor.findById(id);

    if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json(vendor);
}

module.exports = {
    getAllVendors,
    getVendorByID
}
