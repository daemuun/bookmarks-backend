import express from "express";
import mongoose from "mongoose";

import auth from "./routes/auth.js";
import bookmark from "./routes/bookmark.js";
import { Bookmark } from "./models/bookmark.js";
import cors from 'cors'

import dotenv from "dotenv"
import { User } from "./models/user.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors({ origin: "*", methods: "*", allowedHeaders: "*" }));

app.use("/auth", auth);
app.use("/b", bookmark);

app.get('/health', (_, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

app.get("/:bookmarkId", async (req, res) => {
    try {
        const bookmarkId = req.params["bookmarkId"];
        const bookmark = await Bookmark.findById(bookmarkId);
        if (!bookmark) {
            console.log("Bookmark not found");
            return res.status(404).json({ error: "Bookmark not found" });
        }

        if (!bookmark.public) {
            const authHeader = req.headers.authorization;
            if (!authHeader?.startsWith('Bearer ')) {
                return res.status(401).json({ error: "Authentication required" });
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (!user || user._id.toString() !== bookmark.userId.toString()) {
                return res.status(403).json({ error: "Access denied" });
            }
        }

        await Bookmark.findByIdAndUpdate(
            bookmarkId,
            {
                $inc: { clicksCount: 1 },
                $set: { lastClicked: new Date() }
            }
        );

        res.status(307).redirect(bookmark.url);
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





