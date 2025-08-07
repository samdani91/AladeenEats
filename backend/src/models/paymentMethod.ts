import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stripePaymentMethodId: { type: String, required: true },
  cardBrand: { type: String, required: true },
  last4: { type: String, required: true },
  expiryMonth: { type: Number },
  expiryYear: { type: Number },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);
export default PaymentMethod;