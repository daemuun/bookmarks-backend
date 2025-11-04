import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookmarkScheme = new Schema({
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    tags: { type: [String], default: [] },
    icon: { type: String, default: '/static/default_icon.png', trim: true },

    userId: { type: Schema.Types.ObjectId, required: true },
    clicksCount: { type: Number, default: 0 },
    lastClicked: { type: Date, default: Date.now },
    domain: { type: String, default: '', trim: true }
}, { timestamps: true });

export const Bookmark = mongoose.model("Bookmark", bookmarkScheme);
