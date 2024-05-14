const mongoose = require('mongoose');

const gearSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    description: {
        type: String
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

module.exports = mongoose.model('Gear', gearSchema);

