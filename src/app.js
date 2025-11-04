import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import { User } from "./models/user.js";
import auth from "./routes/auth.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static("static"));
app.use(express.json());
app.use("/auth", auth);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});


async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/usersdb");
        app.listen(PORT);
        console.log("Server start on port ", PORT);
    }
    catch (err) {
        return console.log(err);
    }

}

main();





