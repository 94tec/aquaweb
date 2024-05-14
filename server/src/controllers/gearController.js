const Gear = require('../models/Gear');

exports.getAllGears = async (req, res) => {
    try {
        const gears = await Gear.find();
        res.json(gears);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving gears', error: err });
    }
};

exports.createGear = async (req, res) => {
    const { type, description } = req.body;
    try {
        const newGear = new Gear({ type, description });
        await newGear.save();
        res.status(201).json(newGear);
    } catch (err) {
        res.status(500).json({ message: 'Error creating gear', error: err });
    }
};

exports.getGear = async (req, res) => {
    try {
        const gear = await Gear.findById(req.params.id);
        if (!gear) {
            return res.status(404).json({ message: 'Gear not found' });
        }
        res.json(gear);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving gear', error: err });
    }
};

exports.updateGear = async (req, res) => {
    const { type, description } = req.body;
    try {
        const gear = await Gear.findByIdAndUpdate(
            req.params.id,
            { type, description },
            { new: true, runValidators: true }
        );
        if (!gear) {
            return res.status(404).json({ message: 'Gear not found' });
        }
        res.json(gear);
    } catch (err) {
        res.status(500).json({ message: 'Error updating gear', error: err });
    }
};

exports.deleteGear = async (req, res) => {
    try {
        const gear = await Gear.findByIdAndDelete(req.params.id);
        if (!gear) {
            return res.status(404).json({ message: 'Gear not found' });
        }
        res.json({ message: 'Gear deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting gear', error: err });
    }
};
