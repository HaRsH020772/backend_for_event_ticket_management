const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please provide a name']
        },
        lastName: {
            type: String,
            required: [true, 'Please provide a name']
        },
        email: {
            type: String,
            required: [true, 'Please provide a email'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            select: false
        },
        role: {
            type: String,
            enum: ['USER', 'ADMIN'],
            default: 'USER',
            required: true
        },
        profile: {
            id:
            {
                type: String,
                default: ""
            },
            secure_url:
            {
                type: String,
                default: ""
            }
        },
        eventAttended: {
            type: Number,
            default: 0
        },
        organisation: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    });

//* encrypt password before save - HOOKS

userSchema.pre('save', async function (next) {

    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
})

// //* Validates the password
userSchema.methods.isValidatePassword = async function (userSendPassword) {
    return await bcrypt.compare(userSendPassword, this.password);
}

// //* create and return jwt token
userSchema.methods.getJwtToken = function () {

    return jwt.sign(
        {
            id: this._id,
            email: this.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    );
}

module.exports = mongoose.model('User', userSchema);
