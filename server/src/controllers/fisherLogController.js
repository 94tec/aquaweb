const FisherLog = require('../models/FisherLog');
const Fisher = require('../models/Fisher');

exports.getAllLogs = async (req, res) => {
    try {
        const logs = await FisherLog.find().populate('fisher', 'username email').populate('vessel', 'name');
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving logs', error: err });
    }
};

exports.createLog = async (req, res) => {
    const { fisher, vessel, date, startTime, endTime, activities, notes } = req.body;
    try {
        const newLog = new FisherLog({ fisher, vessel, date, startTime, endTime, activities, notes });
        await newLog.save();

        // Add log to fisher's logs array
        await Fisher.findByIdAndUpdate(fisher, { $push: { fisherLogs: newLog._id } });

        res.status(201).json(newLog);
    } catch (err) {
        res.status(500).json({ message: 'Error creating log', error: err });
    }
};

exports.getLog = async (req, res) => {
    try {
        const log = await FisherLog.findById(req.params.id).populate('fisher', 'username email').populate('vessel', 'name');
        if (!log) {
            return res.status(404).json({ message: 'Log not found' });
        }
        res.json(log);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving log', error: err });
    }
};

exports.updateLog = async (req, res) => {
    const { fisher, vessel, date, startTime, endTime, activities, notes } = req.body;
    try {
        const log = await FisherLog.findByIdAndUpdate(
            req.params.id,
            { fisher, vessel, date, startTime, endTime, activities, notes },
            { new: true, runValidators: true }
        );
        if (!log) {
            return res.status(404).json({ message: 'Log not found' });
        }
        res.json(log);
    } catch (err) {
        res.status(500).json({ message: 'Error updating log', error: err });
    }
};

exports.deleteLog = async (req, res) => {
    try {
        const log = await FisherLog.findByIdAndDelete(req.params.id);
        if (!log) {
            return res.status(404).json({ message: 'Log not found' });
        }

        // Remove log from fisher's logs array
        await Fisher.findByIdAndUpdate(log.fisher, { $pull: { fisherLogs: log._id } });

        res.json({ message: 'Log deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting log', error: err });
    }
};
