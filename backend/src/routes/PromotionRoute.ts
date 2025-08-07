import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import PromotionController from "../controllers/PromotionController";
import { validatePromotionRequest } from "../middleware/validation";

const router = express.Router();

router.get("/", PromotionController.getPromotions);
router.post("/", jwtCheck, jwtParse, validatePromotionRequest, PromotionController.createPromotion);
router.put("/:promotionId", jwtCheck, jwtParse, validatePromotionRequest, PromotionController.updatePromotion);
router.delete("/:promotionId", jwtCheck, jwtParse, PromotionController.deletePromotion);

export default router;