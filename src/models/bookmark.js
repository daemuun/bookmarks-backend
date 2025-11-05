import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    tags: { type: [String], default: [] },
    public: {type: Boolean, default: false},
    userId: { type: Schema.Types.ObjectId, required: true },
    clicksCount: { type: Number, default: 0 },
    lastClicked: { type: Date, default: Date.now },
    domain: { type: String, trim: true }
    
}, { timestamps: true });

bookmarkSchema.pre('save', function(next) {
    if(this.url) {
        try {
            const urlObj = new URL(this.url);
            this.domain = urlObj.hostname;
            this.domain = this.domain.replace(/^www\./, '');
        } catch (err) {
            this.domain = 'incorrect-url'
        }
    } else {
        this.domain = 'no-url'
    }
    next();
});

bookmarkSchema.index({userId: 1, domain: 1});
bookmarkSchema.index({userId: 1, tags: 1});

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
