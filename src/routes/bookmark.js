import express from 'express'
import { Bookmark } from '../models/bookmark.js'
import auth from '../middleware/auth.js'

const bookmark = express.Router();

bookmark.post("/", auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, url, description, tags, icon } = req.body;

        const bookmark = new Bookmark({
            title,
            url,
            description,
            tags,
            icon,
            userId
        });

        await bookmark.save();


        res.status(201).json({ message: "Bookmark has been created", bookmark: bookmark });
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

export default bookmark;
