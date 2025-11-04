import express from 'express'
import { User } from '../models/user.js';
import authMiddleware from '../middleware/auth.js';

const auth = express.Router();

auth.post("/register", async (req, res) => {
    try {
        const { login, password, userName } = req.body;

        const existingUser = await User.findOne({ login });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPasswd = await User.hashPasswd(password);
        const user = new User({ login, hashedPasswd, userName });

        await user.save();

        return res.status(201).json({
            message: "User created",
            user: { id: user._id, login: user.logijn, userName: user.userName }
        });
    } catch(err) {
        console.error('Registration error:', error);
        return res.status(500).json({error: "Registration failed"});
    }
});

auth.get('/profile', authMiddleware, (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            login: req.user.login,
            userName: req.user.userName
        }
    });
});

export default auth;
