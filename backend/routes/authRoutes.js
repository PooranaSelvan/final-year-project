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

router.post("/login", authUser);
router.post("/logout", logoutUser);
router.route("/auth").get(checkUser).post(checkUser);

router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

router.route("/").post(registerUser).get(protect, admin, getUsers);

router.route("/:id").delete(protect, admin, deleteUser)
    .get(protect, admin, getUserByID)
    .put(protect, admin, updateUser); 
  

export default router;