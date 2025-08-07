import mongoose from "mongoose";

const deliveryAgentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  lastUpdated: { type: Date, default: Date.now },
});

deliveryAgentSchema.index({ location: "2dsphere" });

const DeliveryAgent = mongoose.model("DeliveryAgent", deliveryAgentSchema);
export default DeliveryAgent;