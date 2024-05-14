const mongoose = require('mongoose');

const vesselSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    fishery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fishery',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fishers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fisher'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Vessel', vesselSchema);
