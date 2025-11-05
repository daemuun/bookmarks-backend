import express from "express";
import mongoose from "mongoose";

import auth from "./routes/auth.js";
import optionalAuth from "./middleware/optionalAuth.js";
import bookmark from "./routes/bookmark.js";
import { Bookmark } from "./models/bookmark.js";
import cors from 'cors'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from "dotenv"

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();


const currentDir = dirname(fileURLToPath(import.meta.url));
app.use(express.static(`${currentDir}/public`));
app.use(express.json());
app.use(cors({ origin: "*", methods: "*", allowedHeaders: "*" }));

app.use("/auth", auth);
app.use("/b", bookmark);

app.get('/health', (_, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});


app.get("/:bookmarkId", optionalAuth, async (req, res) => {
    try {
        const bookmark = await Bookmark.findById(req.params.bookmarkId);
        if (!bookmark) return res.status(404).json({ error: "Bookmark not found" });

        const loggedInUserId = req.user ? req.user._id : null;

        if (!bookmark.public && (!loggedInUserId || bookmark.userId.toString() !== loggedInUserId.toString())) {
            return res.status(403).json({ 
                error: "Доступ запрещен. Только владелец может перейти по этой приватной ссылке." 
            });
        }

        Bookmark.findByIdAndUpdate(bookmark._id, {
            $inc: { clicksCount: 1 },
            $set: { lastClicked: new Date() }
        }).catch(console.error);

        return res.redirect(307, bookmark.url);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

async function main() {
    try {
        await mongoose.connect(process.env.DB_LINK);
        app.listen(PORT);
        console.log("Server start on port ", PORT);
    }
    catch (err) {
        return console.log(err.message);
    }

}

main();





