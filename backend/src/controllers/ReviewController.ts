// controllers/ReviewController.ts
import { Request, Response } from "express";
import Review from "../models/review";
import Restaurant from "../models/restaurant";
import mongoose from "mongoose";

const getReviews = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const reviews = await Review.find({ restaurant: restaurantId }).populate("user");
    res.json(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

const createReview = async (req: Request, res: Response) => {
  try {
    const { restaurantId, rating, comment, menuItemId } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const review = new Review({
      user: req.userId,
      restaurant: restaurantId,
      rating,
      comment,
      menuItemId: menuItemId ? new mongoose.Types.ObjectId(menuItemId) : undefined,
    });
    await review.save();

    // Update restaurant average rating
    const reviews = await Review.find({ restaurant: restaurantId });
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    restaurant.averageRating = Math.round(averageRating * 10) / 10;
    await restaurant.save();

    res.status(201).json(review);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating review" });
  }
};

export default {
  getReviews,
  createReview,
};