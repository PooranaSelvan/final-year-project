import User from "./models/userModel.js";
import Product from "./models/productModel.js";
// import Order from "./models/orderModel.js";

import products from "./data/products.js";
import users from "./data/users.js";

import { connectDB } from "./db/config.js";


const importData = async () => {

    await connectDB();


    try{

        await Product.deleteMany();
        await User.deleteMany();

        const createUser = await User.insertMany(users);
        // console.log(createUser);

        const adminUser = createUser[0]._id;
        // console.log(adminUser);

        const sampleProducts = products.map((product) => {
            return {...product, user:adminUser};
        });

        const Products = await Product.insertMany(sampleProducts);
        // console.log(Products);

        console.log("Date Imported");

        process.exit();

    }catch(error){
        console.log(error);
        process.exit(1);
    }

}

const destroyData = async () => {

    try{

        await Product.deleteMany();
        await User.deleteMany();

        console.log("Data Destroyed");
        process.exit();
    } catch(error){
        console.log(err);
        process.exit(1);
    }

}

if(process.argv[2] === "-d"){
    destroyData();
} else {
    importData();
}