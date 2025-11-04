import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    login: { type: String, required: true, unique: true, trim: true, minLength: 3 },
    hashedPasswd: { type: String, required: true },
    userName: { type: String, default: "User", trim: true, minLength: 2, maxLength: 50 },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
