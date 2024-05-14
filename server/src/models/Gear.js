const mongoose = require('mongoose');

const gearSchema = new mongoose.Schema({
    type: { type: String, required: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model('Gear', gearSchema);
