import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    phone: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['customer', 'restaurantAdmin', 'superAdmin'],
        default: 'customer'
    },
}, { timestamps: true });

// Add name virtual field
// userSchema.virtual('name').get(function() {
//     return `${this.firstName} ${this.lastName}`;
// });

// Generate token method
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: '7d',
    });
    return token;
};

const User = mongoose.model('User', userSchema);

// Validation function
const validate = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().label('Name'), // Change to accept name instead of firstName/lastName
        email: Joi.string().email().required().label('Email'),
        password: passwordComplexity().required().label('Password'),
        phone: Joi.string().allow('').optional().label('Phone'),
    });
    return schema.validate(data);
};

export { User, validate };