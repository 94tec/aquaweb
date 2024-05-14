const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const fisherSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    middlename: {
        type: String,
    },
    lastname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phonenumber: {
        type: Number
    },
    id: {
        type: Number
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'fisher'],
        default: 'fisher'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fisherLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FisherLog' }],
    vessels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vessel' }],
    gears: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gear' }]
}, { timestamps: true });

fisherSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

fisherSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

fisherSchema.methods.generateJWT = function () {
    return jwt.sign({
        id: this._id,
        username: this.username,
        email: this.email
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const Fisher = mongoose.model('Fisher', fisherSchema);

module.exports = Fisher;
