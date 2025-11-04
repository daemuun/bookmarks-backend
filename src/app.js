import express from "express";
import mongoose from "mongoose";

import auth from "./routes/auth.js";
import bookmark from "./routes/bookmark.js";

import dotenv from "dotenv"
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static("static"));
app.use(express.json());

app.use("/auth", auth);
app.use("/bookmark", bookmark);

app.get('/health', (_, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

async function main() {
    try {
        await mongoose.connect(process.env.DB_LINK);
        app.listen(PORT);
        console.log("Server start on port ", PORT);
    }
    catch (err) {
        return console.log(err);
    }

}

main();





