import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// authUser
// /api/users/login
const authUser = asyncHandler(async (req, res) => {
    // console.log(req.body)
    const {email, password} = req.body; 
    const user = await User.findOne({email});
    // console.log(user);

    if(user && (await user.matchPassword(password))){
    
        generateToken(res,user._id);

        res.json({
        _id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin,
        isSeller:user.isSeller
        });
    } else{
        res.status(401);
        throw new Error("Invalid Email Or Password");
    }
});


// @Access Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;
    // console.log(name,email,password)

    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error("User Already Exists"); 
    }

    const user = await User.create({
        name,
        email,
        password
    });
    
    if(user){
        generateToken(res,user._id);
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            isSeller:user.isSeller
        });
    } else{
        res.status(400);
        throw new Error("Invalid User Data");
    }

});

// @Access Private
// /api/users/logout
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0), 
    });

    res.status(200).json({message:"Logged out successfully"});
});


// @Access Public
// /api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if(user){
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            // password:user.password,
            isAdmin:user.isAdmin,
            isSeller:user.isSeller
        })
    }else {
        res.status(404);
        throw new Error("User not found");
    }
});


/// @Access Private
// /api/users/profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const { name, email, password } = req.body;

    if (name) user.name = name;
    
    if (email) {
        if (!validateEmail(email)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }
        user.email = email;
    }

    if (password) {
        if (password.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters' });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    console.log(user);

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: "Profile updated successfully",
    });
});

export const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
};



// @Access Public
// /api/users
const getUsers = asyncHandler(async (req, res) => {

    const { isAdmin } = req.body;

    if(isAdmin === false){
        res.status(401);
        throw new Error("Unauthorized");
    }


    try{

        const allUsers = await User.find({});

        if(!allUsers || allUsers.length === 0){
            res.status(401).json({message:"Message Not Found"});
        }

        res.status(200).json(allUsers);

    } catch(err){
        console.log(err);
        res.status(500);
    }
});

// @Access Public
// /api/users/:id
const getUserByID = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    // Find the user by ID
    const user = await User.findById(id);
  
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
  
    res.status(200).json(user);
});


// @Access Private
// /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    // Find the user by ID and delete
    const user = await User.findByIdAndDelete(id);
  
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
  
    res.status(200).json({ message: 'User deleted successfully' });
  });

// @Access Private
// /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
  
    // Find the user by ID and update their data
    const user = await User.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated user
      runValidators: true, // Validate the data using the model schema
    });
  
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
  
    res.status(200).json(user);
  });


  
  const checkUser = asyncHandler(async (req, res) => {
    const token = req.cookies.jwt;
    // console.log(token);
    if (token) {
        try {
            const decoded = jwt.verify(token, "secret"); // Verify the token
            // console.log(decoded);
            const user = await User.findById(decoded.userId); // Assuming you are checking user info
            // console.log(user);

            if (user) {
                res.json({ isLoggedIn: true, user });
            } else {
                res.status(401).json({ isLoggedIn: false });
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ isLoggedIn: false });
        }
    } else {
        res.json({ isLoggedIn: false });
    }
});


export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserByID,
    deleteUser,
    updateUser,
    checkUser
}