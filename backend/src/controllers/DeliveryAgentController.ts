import { Request, Response } from "express";
import DeliveryAgent from "../models/deliveryAgent";
import Order from "../models/order";

const getAgentLocation = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order || order.user?.toString() !== req.userId) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    const agent = await DeliveryAgent.findOne({ order: orderId });
    if (!agent) {
      return res.status(404).json({ message: "Delivery agent not assigned" });
    }

    res.json({ location: agent.location });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default { getAgentLocation };