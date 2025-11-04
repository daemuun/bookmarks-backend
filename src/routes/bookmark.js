import express from 'express'
import { Bookmark } from '../models/bookmark.js'
import auth from '../middleware/auth.js'

const bookmark = express.Router();

bookmark.post("/", auth, async (req, res) => {
    try {
        const userId = req.user._id;

        const bookmark = new Bookmark({
            ...req.body,
            userId
        });

        await bookmark.save();


        res.status(201).json({ message: "Bookmark has been created", bookmark: bookmark });
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

bookmark.delete("/:bookmarkId", auth, async (req, res) => {
    try {
        const bookmarkId = req.params["bookmarkId"];
        const bookmark = Bookmark.findById(bookmarkId);
        if (!bookmark) {
            console.log("Bookmark not found");
            return res.status(404).json({ error: "Bookmark not found" });
        }
        await Bookmark.deleteOne(bookmark)
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

bookmark.get("/", auth, async (req, res) => {
    try {
        const tags = req.query.tag;

        const userId = req.user._id;
        const filter = { userId };

        if (tags) {
            if (Array.isArray(tags)) {
                filter.tags = { $in: tags };
            } else {
                filter.tags = tags;
            }
        }

        const bookmarks = await Bookmark.find(filter)

        res.json({
            ok: true,
            data: bookmarks,
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


export default bookmark;
