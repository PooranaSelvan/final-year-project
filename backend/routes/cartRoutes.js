import express from "express";
import { addToCart, getCart, removeFromCart, updateCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authHandler.js";

const router = express.Router();

router
  .route("/")
  .post(protect, addToCart)
  .get(protect, getCart)
  .put(protect, updateCart)
  .delete(protect, removeFromCart);

export default router;