import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    keywords: [{ type: String, trim: true, lowercase: true }],
    minMatches: { type: Number, default: 1, min: 1 },
    isActive: { type: Boolean, default: true },
    showOnBot: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Faq", faqSchema);
