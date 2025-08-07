import { Request, Response } from "express";
import Stripe from "stripe";
import PaymentMethod from "../models/paymentMethod";
import User from "../models/user";
import { log } from "console";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);

const getPaymentMethods = async (req: Request, res: Response) => {
  try {
    const paymentMethods = await PaymentMethod.find({ user: req.userId });
    res.json(paymentMethods);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching payment methods" });
  }
};

const addPaymentMethod = async (req: Request, res: Response) => {
  try {
    const { paymentMethodId } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const stripePaymentMethod = await STRIPE.paymentMethods.retrieve(paymentMethodId);
    if (!stripePaymentMethod.card) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const paymentMethod = new PaymentMethod({
      user: req.userId,
      stripePaymentMethodId: paymentMethodId,
      cardBrand: stripePaymentMethod.card.brand,
      last4: stripePaymentMethod.card.last4,
      expiryMonth: stripePaymentMethod.card.exp_month,
      expiryYear: stripePaymentMethod.card.exp_year,
      isDefault: !(await PaymentMethod.exists({ user: req.userId })),
    });
    await paymentMethod.save();

    res.status(201).json(paymentMethod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding payment method" });
  }
};

const deletePaymentMethod = async (req: Request, res: Response) => {
  try {
    const { paymentMethodId } = req.params;
    const paymentMethod = await PaymentMethod.findOne({
      _id: paymentMethodId,
      user: req.userId,
    });
    if (!paymentMethod) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    await STRIPE.paymentMethods.detach(paymentMethod.stripePaymentMethodId);
    await paymentMethod.deleteOne();
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting payment method" });
  }
};

export default {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
};