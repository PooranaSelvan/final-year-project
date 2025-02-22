import express from "express";
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserByID,
    deleteUser,
    updateUser, checkUser} from "../controllers/authController.js";
import {protect, admin} from "../middleware/authHandler.js";

const router = express.Router();

router.post("/login", authUser);       // Login user
router.post("/logout", logoutUser);    // Logout user
router.route("/auth").get(checkUser).post(checkUser);

router.route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);  // Profile routes

router.route("/")
    .post(registerUser)                // Register user
    .get(protect, admin, getUsers);    // Get all users (admin only)

router.route("/:id")
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserByID)
    .put(protect, admin, updateUser);  // User management by ID (admin only)
  

export default router;