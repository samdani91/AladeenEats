import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import ReviewController from "../controllers/ReviewController";
import { validateReviewRequest } from "../middleware/validation";

const router = express.Router();

router.get("/:restaurantId", ReviewController.getReviews);
router.post("/", jwtCheck, jwtParse, validateReviewRequest, ReviewController.createReview);

export default router;