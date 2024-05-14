const mongoose = require('mongoose');

const catchSchema = new mongoose.Schema({
    fishery: { type: mongoose.Schema.Types.ObjectId, ref: 'Fishery', required: true },
    species: { type: String, required: true },
    weight: { type: Number, required: true },
    date: { type: Date, required: true },
});

module.exports = mongoose.model('Catch', catchSchema);
