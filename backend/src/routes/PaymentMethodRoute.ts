import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import PaymentMethodController from "../controllers/PaymentMethodController";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, PaymentMethodController.getPaymentMethods);
router.post("/", jwtCheck, jwtParse, PaymentMethodController.addPaymentMethod);
router.delete("/:paymentMethodId", jwtCheck, jwtParse, PaymentMethodController.deletePaymentMethod);

export default router;