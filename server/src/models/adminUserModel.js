const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminUserSchema = new mongoose.Schema({
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
    phonenumber: Number,
    id: Number,
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

adminUserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

adminUserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

adminUserSchema.methods.generateJWT = function () {
    return jwt.sign({
        id: this._id,
        username: this.username,
        email: this.email
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser;
