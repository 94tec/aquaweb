const mongoose = require('mongoose');

const fisherLogSchema = new mongoose.Schema({
    fisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fisher',
        required: true
    },
    vessel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vessel'
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    activities: {
        type: String
    },
    notes: {
        type: String
    },
    catches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Catch'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('FisherLog', fisherLogSchema);
