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


        res.status(201).json({ message: "Bookmark has been created", ok: true, data: bookmark });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

bookmark.delete("/:bookmarkId", auth, async (req, res) => {
    try {
        const bookmarkId = req.params.bookmarkId;
        const bookmark = await Bookmark.findOne({ _id: bookmarkId, userId: req.user._id });

        if (!bookmark) {
            return res.status(404).json({ error: "Bookmark not found" });
        }

        await Bookmark.deleteOne({ _id: bookmarkId });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
        res.status(500).json({ error: err.message });
    }
});

bookmark.get("/:bookmarkId", auth, async (req, res) => {
    try {
        const bookmarkId = req.params["bookmarkId"];
        const bookmark = await Bookmark.findById(bookmarkId);
        if (!bookmark) {
            console.log("Bookmark not found");
            return res.status(404).json({ error: "Bookmark not found" });
        }
        res.json({ ok: true, data: bookmark });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

bookmark.patch("/:bookmarkId", auth, async (req, res) => {
    try {
        const title = req.body.title;
        const url = req.body.url;
        const description = req.body.description;
        const tags = req.body.tags;
        const icon = req.body.icon;

        const bookmarkId = req.params["bookmarkId"];
        const updatedBookmark = await Bookmark.findOneAndUpdate(
            { _id: bookmarkId, userId: req.user._id },
            { title, url, description, tags, icon },
            { new: true }
        );

        if (!updatedBookmark) {
            return res.status(404).json({ error: "Bookmark not found" });
        }

        res.json({ ok: true, data: updatedBookmark });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
export default bookmark;
