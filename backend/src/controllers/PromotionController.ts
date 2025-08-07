import { Request, Response } from "express";
import Promotion from "../models/promotion";
import Restaurant from "../models/restaurant";

const getPromotions = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.query;
    const query = restaurantId ? { restaurant: restaurantId, isActive: true, validUntil: { $gte: new Date() } } : {};
    const promotions = await Promotion.find(query).populate("restaurant");
    res.json(promotions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching promotions" });
  }
};

const createPromotion = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const promotion = new Promotion({
      ...req.body,
      restaurant: restaurant._id,
    });
    await promotion.save();
    res.status(201).json(promotion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating promotion" });
  }
};

const updatePromotion = async (req: Request, res: Response) => {
  try {
    const { promotionId } = req.params;
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const promotion = await Promotion.findOne({ _id: promotionId, restaurant: restaurant._id });
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    Object.assign(promotion, req.body);
    await promotion.save();
    res.json(promotion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating promotion" });
  }
};

const deletePromotion = async (req: Request, res: Response) => {
  try {
    const { promotionId } = req.params;
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const promotion = await Promotion.findOneAndDelete({ _id: promotionId, restaurant: restaurant._id });
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting promotion" });
  }
};

export default {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
};