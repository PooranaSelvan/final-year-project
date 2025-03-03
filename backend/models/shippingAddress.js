import mongoose from "mongoose";

const shippingAddressSchema = mongoose.Schema({
     userId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
       required: true,
     },
     addresses: [
       {
         fullName: { type: String, required: true },
         address: { type: String, required: true },
         city: { type: String, required: true },
         state: { type: String, required: true },
         postalCode: { type: String, required: true },
         country: { type: String, required: true },
         phone: { type: String, required: true },
       },
     ],
   }, { timestamps: true });
   
   const ShippingAddress = mongoose.model("ShippingAddress", shippingAddressSchema);

   export default ShippingAddress;