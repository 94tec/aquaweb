const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Fisher = require('../models/Fisher');
const Fishery = require('../models/Fishery');
const Vessel = require('../models/Vessel');
const Gear = require('../models/Gear');

exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while getting users." });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        // Assuming your verifyToken middleware adds the user's ID to req.user
        const userId = req.user.id;
        
        // Fetch the user from the database
        const user = await User.findById(userId).select('-password'); // Exclude password from the result
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user data
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while getting  User Profile." });
    }
}
exports.createFisher = async (req, res) => {
    try {
        const { firstname, middlename, lastname, username, email, phonenumber, id, password, role, fisherLogs, vessels, gears } = req.body;

        const existingFisher = await Fisher.findOne({ $or: [{ username }, { email }] });
        if (existingFisher) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const newFisher = new Fisher({
            firstname,
            middlename,
            lastname,
            username,
            email,
            phonenumber,
            id,
            password,
            role,
            createdBy: req.user.id,
            fisherLogs,
            vessels,
            gears
        });

        await newFisher.save();
        // Push the created fisher ID to the user's addedFishers array
        await User.findByIdAndUpdate(req.user.id, { $push: { addedFishers: newFisher._id } });
        // Generate JWT token
        const token = jwt.sign(
            { id: newFisher._id, username: newFisher.username, role: newFisher.role },
            process.env.JWT_SECRET, // Ensure you have a JWT_SECRET in your environment variables
            { expiresIn: '1h' }
        );

        // Respond with success
        res.status(201).json({ message: 'User registered successfully', token });
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.getAllFishers = async (req, res) => {
    try {
        // Fetch all users from the database
        const fishers = await Fisher.find({});
        res.json(fishers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while getting users." });
    }
};
// View Fisher
exports.getFisher = async (req, res) => {
    try {
        const fisher = await Fisher.findById(req.params.id);
        if (!fisher) {
            return res.status(404).json({ message: 'Fisher not found' });
        }
        res.status(200).json(fisher);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving the fisher details', error: error.message });
    }
};
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
//Fishery
exports.createFishery = async (req, res) => {
    try {
        const { name, location } = req.body;

        // Create a new Fishery instance
        const newFishery = new Fishery({
            name,
            location,
            createdBy: req.user.id,
        });

        // Save the new Fishery to the database
        await newFishery.save();

        res.status(201).json(newFishery);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getAllFisheries = async (req, res) => {
    try {
        const fisheries = await Fishery.find({});
        res.status(200).json(fisheries);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

// Create Vessel
exports.createVessel = async (req, res) => {
    const { name, type, capacity, registrationNumber, fishery, fishers } = req.body;
    try {
        // Check if the fishery exists
        const existingFishery = await Fishery.findById(fishery);
        if (!existingFishery) {
            return res.status(404).json({ message: 'Fishery not found' });
        }

        const newVessel = new Vessel({
            name,
            type,
            capacity,
            registrationNumber,
            fishery,
            createdBy: req.user.id,
            fishers
        });

        await newVessel.save();
        
        // Push the created vessel's ID to the fishery's vessels array
        await Fishery.findByIdAndUpdate(fishery, { $push: { vessels: newVessel._id } });
        
        res.status(201).json(newVessel);
    } catch (err) {
        res.status(500).json({ message: 'Error creating vessel', error: err.message });
    }
}
exports.getAllVessels = async (req, res) => {
    try {
        const vessels = await Vessel.find({});
        res.status(200).json(vessels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getVesssel = async (req, res) => {
    try {
        const vessel = await Vessel.findById(req.params.id);
        if (!vessel) return res.status(404).json({ message: 'Vessel not found' });
        res.status(200).json(vessel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateVessel = async (req, res) => {
    try {
        const updatedVessel = await Vessel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedVessel) return res.status(404).json({ message: 'Vessel not found' });
        res.status(200).json(updatedVessel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteVessel = async (req, res) => {
    try {
        const deleteVessel = await Vessel.findByIdAndDelete(req.params.id);
        if (!deleteVessel) return res.status(404).json({ message: 'Vessel not found' });
        res.status(200).json({ message: 'Vessel deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fishing Gear
// Create Gear
exports.createGear = async (req, res) => {
    const { type, description } = req.body;
    try {
        // Check if the fishery exists
        const existingFishery = await Fishery.findById(fishery);
        if (!existingFishery) {
            return res.status(404).json({ message: 'Fishery not found' });
        }

        const newGear = new Gear({
            type,
            description,
            createdBy: req.user.id,
        });

        await newGear.save();
        
        // Push the created vessel's ID to the fishery's vessels array
        await Fishery.findByIdAndUpdate(fishery, { $push: { gears: newGear._id } });
        
        res.status(201).json(newGear);
    } catch (err) {
        res.status(500).json({ message: 'Error creating vessel', error: err.message });
    }
}
exports.getAllGears = async (req, res) => {
    try {
        const gears = await Gear.find({});
        res.status(200).json(gears);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGear = async (req, res) => {
    try {
        const gear = await Gear.findById(req.params.id);
        if (!gear) return res.status(404).json({ message: 'Gear not found' });
        res.status(200).json(gear);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateGear = async (req, res) => {
    try {
        const updatedGear = await Gear.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedGear) return res.status(404).json({ message: 'Gear not found' });
        res.status(200).json(updatedGear);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteGear = async (req, res) => {
    try {
        const deleteGear = await Gear.findByIdAndDelete(req.params.id);
        if (!deleteGear) return res.status(404).json({ message: 'Gear not found' });
        res.status(200).json({ message: 'Gear deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
