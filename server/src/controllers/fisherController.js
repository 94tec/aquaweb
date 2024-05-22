// controllers/fisherController.js
const Fisher = require('../models/Fisher');

exports.getAllFishers = async (req, res) => {
    try {
        const fishers = await Fisher.find();
        res.status(200).json(fishers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFisherProfile = async (req, res) => {
    try {
        // Assuming your verifyToken middleware adds the user's ID to req.user
        const fisherId = req.user.id;
        
        // Fetch the user from the database
        const fisher = await Fisher.findById(fisherId).select('-password'); // Exclude password from the result
        if (!fisher) {
            return res.status(404).json({ message: 'Fisher not found' });
        }

        // Respond with user data
        res.json(fisher);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while getting  User Profile." });
    }
};

//Update Fisher
exports.updateFisher = async (req, res) => {
    try {
        const updatedFisher = await Fisher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedFisher) return res.status(404).json({ message: 'Fisher not found' });
        res.status(200).json(updatedFisher);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteFisher = async (req, res) => {
    try {
        const deletedFisher = await Fisher.findByIdAndDelete(req.params.id);
        if (!deletedFisher) return res.status(404).json({ message: 'Fisher not found' });
        res.status(200).json({ message: 'Fisher deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

   