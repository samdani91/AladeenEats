import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  id: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String },
  addresses: [addressSchema],
  phone: { type: String }
});

const User = mongoose.model("User", userSchema);
export default User;