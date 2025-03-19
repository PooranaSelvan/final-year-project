import ShippingAddress from "../models/shippingAddress.js";


export const getShippingAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const shipping = await ShippingAddress.findOne({ userId });

    if (!shipping) return res.json({ addresses: [] });

    res.json(shipping.addresses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


export const addShippingAddress = async (req, res) => {
  try {
    const { fullName, address, city, state, postalCode, country, phone } = req.body;
    const userId = req.user.id;

    let shipping = await ShippingAddress.findOne({ userId });

    if (!shipping) {
      shipping = new ShippingAddress({ userId, addresses: [] });
    }

    shipping.addresses.push({ fullName, address, city, state, postalCode, country, phone });
    await shipping.save();

    res.json(shipping);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


export const deleteShippingAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const shipping = await ShippingAddress.findOne({ userId });

    if (!shipping) return res.status(404).json({ message: "No addresses found" });

    shipping.addresses = shipping.addresses.filter((addr) => addr._id.toString() !== addressId);
    await shipping.save();

    res.json(shipping);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
