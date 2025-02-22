import User from "./models/userModel.js";
import Product from "./models/productModel.js";
// import Order from "./models/orderModel.js";

import products from "./data/products.js";
import users from "./data/users.js";

import { connectDB } from "./db/config.js";


const importData = async () => {

    await connectDB();


    try{

        // Deleting The Db models
        // await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // Inserting Users Into DB
        const createUser = await User.insertMany(users);
        // console.log(createUser);

        // users model ooda first data va get panrom because athu thaa admin
        const adminUser = createUser[0]._id;
        // console.log(adminUser);
        
        // namma json data va map panrom atha adminUser kooda spread panni obj va store panrom
        const sampleProducts = products.map((product) => {
            return {...product, user:adminUser};
        });

        // Inserting Products To The DB
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

        // await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log("Data Destroyed");
        process.exit();
    } catch(error){
        console.log(err);
        process.exit(1);
    }

}

// Cmd Line Arguments used to delete datas from db
if(process.argv[2] === "-d"){
    destroyData();
} else {
    importData();
}