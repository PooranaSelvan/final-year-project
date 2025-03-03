import express from "express";
import {getShippingAddresses, addShippingAddress, deleteShippingAddress} from "../controllers/shippingController.js";
import { protect } from "../middleware/authHandler.js";


const router = express.Router();

router.get("/", protect, getShippingAddresses);
router.post("/", protect, addShippingAddress);
router.delete("/:addressId", protect, deleteShippingAddress);

export default router;