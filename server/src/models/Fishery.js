const mongoose = require('mongoose');

const fisherySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fishers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fisher'
    }],
    vessels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vessel'
    }],
    gears: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gear'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Fishery', fisherySchema);
