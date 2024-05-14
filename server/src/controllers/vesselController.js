const Vessel = require('../models/Vessel');

exports.getAllVessels = async (req, res) => {
    try {
        const vessels = await Vessel.find().populate('owner', 'username email');
        res.json(vessels);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving vessels', error: err });
    }
};

exports.createVessel = async (req, res) => {
    const { name, type, capacity, owner } = req.body;
    try {
        const newVessel = new Vessel({ name, type, capacity, owner });
        await newVessel.save();
        res.status(201).json(newVessel);
    } catch (err) {
        res.status(500).json({ message: 'Error creating vessel', error: err });
    }
};

exports.getVessel = async (req, res) => {
    try {
        const vessel = await Vessel.findById(req.params.id).populate('owner', 'username email');
        if (!vessel) {
            return res.status(404).json({ message: 'Vessel not found' });
        }
        res.json(vessel);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving vessel', error: err });
    }
};

exports.updateVessel = async (req, res) => {
    const { name, type, capacity } = req.body;
    try {
        const vessel = await Vessel.findByIdAndUpdate(
            req.params.id,
            { name, type, capacity },
            { new: true, runValidators: true }
        );
        if (!vessel) {
            return res.status(404).json({ message: 'Vessel not found' });
        }
        res.json(vessel);
    } catch (err) {
        res.status(500).json({ message: 'Error updating vessel', error: err });
    }
};

exports.deleteVessel = async (req, res) => {
    try {
        const vessel = await Vessel.findByIdAndDelete(req.params.id);
        if (!vessel) {
            return res.status(404).json({ message: 'Vessel not found' });
        }
        res.json({ message: 'Vessel deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting vessel', error: err });
    }
};
