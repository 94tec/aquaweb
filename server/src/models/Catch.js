const mongoose = require('mongoose');

const catchSchema = new mongoose.Schema({
    species: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    fisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fisher',
        required: true
    },
    vessel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vessel',
        required: true
    },
    fishery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fishery',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Catch', catchSchema);
