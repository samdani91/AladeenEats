import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  discount: { type: Number, required: true }, // Percentage (e.g., 10 for 10%)
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

const Promotion = mongoose.model("Promotion", promotionSchema);
export default Promotion;