import {User , validate} from "../models/user.js" // Import from user.js, not validators.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import setCookies from "../utils/setCookies.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        console.log('Received registration data:', { name, email, phone }); // Debug log

        // Validate input using the validate function from user.js
        const { error } = validate(req.body);
        if (error) {
            console.log('Validation error:', error.details[0].message); // Debug log
            return res.status(400).json({ 
                message: error.details[0].message 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email); // Debug log
            return res.status(400).json({ 
                message: 'User already exists with this email' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(Number(process.env.SALT || 10));
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with the correct fields
        const user = new User({
            name,           
            email,
            password: hashedPassword,
            phone: phone || '',
        });

        console.log('Creating user:', user); // Debug log

        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return response
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required."
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Password is required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(404).json({
                message: "Invalid password."
            });
        }

        const accessTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
        const accessToken = jwt.sign({ userId: user._id, username: user.name, exp: accessTokenExp }, process.env.JWT_SECRET);

        setCookies(res, accessToken, accessTokenExp);

        res.status(200).json({
            message: "Login successful.",
            accessToken: accessToken,
            accessTokenExp: accessTokenExp,
            isAuthenticated: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            }
        });
    } catch (err) {
        console.log("login error", err);
        return res.status(500).json({
            message: "Internal server error. Please try again."
        });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/',
        });

        res.clearCookie("isAuthenticated", {
            httpOnly: false,
            secure: true,
            sameSite: 'None',
            path: '/',
        });

        res.status(200).json({ message: "Log out successful" });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ message: "Internal server error during logout" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.user_id;

        if (!userId) {
            return res.status(401).json({ message: "You are not authorized to change the password!" });
        }

        const { currentPassword, newPassword } = req.body;

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, existingUser.password);

        if (!isMatch) {
            return res.status(404).json({
                message: "Incorrect current password."
            });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        return res.status(200).json({
            message: "Password changed successfully.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error. Please try again."
        });
    }
};

export const resetForgotPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findByIdAndUpdate(existingUser._id, { password: hashedPassword });

        return res.status(200).json({
            message: "Password reset successfully.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error. Please try again."
        });
    }
};