import mongoose from "mongoose";
import bcrypt from "bcrypt"

const Schema = mongoose.Schema;

const userSchema = new Schema({
    login: { type: String, required: true, unique: true, trim: true, minLength: 3 },
    hashedPasswd: { type: String, required: true },
    userName: { type: String, default: "User", trim: true, minLength: 2, maxLength: 50 },
}, { timestamps: true });


userSchema.methods.verifyPasswd = async function(passwd) {
    return await bcrypt.compare(passwd, this.hashedPasswd);
}   

userSchema.statics.hashPasswd = async (passwd) => {
    const saltRounds = 12;
    return await bcrypt.hash(passwd, saltRounds);
}

export const User = mongoose.model("User", userSchema);
