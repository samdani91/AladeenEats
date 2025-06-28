import express from "express";
import { register, login, logout, changePassword, resetForgotPassword  } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/changePassword", authenticateToken ,changePassword);
router.put("/resetForgotPassword", resetForgotPassword);
router.post("/logout",authenticateToken,logout);


export default router;