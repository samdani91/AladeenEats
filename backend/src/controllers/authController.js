import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import setCookies from "../utils/setCookies.js";

export const register = async (req, res) => {
    try {
        const { name, phoneNumber, email, password } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Name is required."
            });
        }

        if (!phoneNumber) {
            return res.status(400).json({
                message: "Phone number is required."
            });
        }

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

        const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email or phone number already exists."
            });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            phoneNumber,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "Registration successful.",
        });

    } catch (err) {
        console.log("Registration error:", err);
        return res.status(500).json({
            message: "Internal server error. Please try again."
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