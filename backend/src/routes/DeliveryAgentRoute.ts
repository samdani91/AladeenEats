import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import DeliveryAgentController from "../controllers/DeliveryAgentController";

const router = express.Router();

router.get("/:orderId", jwtCheck, jwtParse, DeliveryAgentController.getAgentLocation);

export default router;