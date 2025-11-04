import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookmarkScheme = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: '' },
    tags: { type: [String], default: [] },
    icon: { type: String, default: '/static/default_icon.png' },

    userId: { type: Schema.Types.ObjectId, required: true },
    clicksCount: { type: Number, default: 0 },
    lastClicked: { type: Date, default: Date.now },
    domain: { type: String, default: '' }
}, { timestamps: true });

export const Bookmark = mongoose.model("Bookmark", bookmarkScheme);
