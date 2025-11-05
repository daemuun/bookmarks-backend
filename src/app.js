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
        const bookmark = await Bookmark.findById(req.params.bookmarkId);
        if (!bookmark) return res.status(404).json({ error: "Bookmark not found" });

        if (bookmark.public) {
            await Bookmark.findByIdAndUpdate(bookmark._id, {
                $inc: { clicksCount: 1 },
                $set: { lastClicked: new Date() }
            });
            return res.redirect(307, bookmark.url);
        }


        res.send(`
            <html>
                <body>
                    <h2>Private Bookmark</h2>
                    <p>This is a private bookmark. Please login to access it.</p>
                    <a href="/login">Login</a>
                </body>
            </html>
        `);
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





