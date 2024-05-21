// controllers/fisheryController.js
const Fishery = require('../models/Fishery');

exports.getAllFisheries = async (req, res) => {
    try {
        const fisheries = await Fishery.find();
        res.status(200).json(fisheries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createFishery = async (req, res) => {
    try {
        const newFishery = new Fishery(req.body);
        await newFishery.save();
        res.status(201).json(newFishery);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getFishery = async (req, res) => {
    try {
        const fishery = await Fishery.findById(req.params.id);
        if (!fishery) return res.status(404).json({ message: 'Fishery not found' });
        res.status(200).json(fishery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateFishery = async (req, res) => {
    try {
        const updatedFishery = await Fishery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedFishery) return res.status(404).json({ message: 'Fishery not found' });
        res.status(200).json(updatedFishery);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteFishery = async (req, res) => {
    try {
        const deletedFishery = await Fishery.findByIdAndDelete(req.params.id);
        if (!deletedFishery) return res.status(404).json({ message: 'Fishery not found' });
        res.status(200).json({ message: 'Fishery deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
