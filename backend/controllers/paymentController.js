import Order from '../models/orderModel.js';  // Assuming you have an Order model to save data
import { Cashfree } from "cashfree-pg"; 
import { load } from '@cashfreepayments/cashfree-js';
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const app_id = process.env.CASHFREE_APP_ID;
const secrect_key = process.env.CASHFREE_API_KEY;
Cashfree.XEnvironment = process.env.NODE_ENV;

let cashfree;
var initializeSDK = async function () {          
    cashfree = await load({
        mode: process.env.NODE_ENV
    });
};
initializeSDK();


// Controller to create an order
export const createCashfreeOrder = async (req, res) => {
  const { userId, orderAmount, customerDetails } = req.body;

  function generateOrderId() {
    const randomId = Math.floor(Math.random() * 100000000); // Generates a random number
    return `shoploot2k25_${randomId}`;
  }

  try {
    const options = {
        method: 'POST',
        url: process.env.NODE_ENV === "production" ? "https://api.cashfree.com/pg/orders" : 'https://sandbox.cashfree.com/pg/orders',
        headers: {
            accept: 'application/json',
            'x-api-version': '2022-09-01',
            'content-type': 'application/json',
            'x-client-id': app_id,
            'x-client-secret': secrect_key
        },
        data: {
            customer_details: {
                customer_id: userId,
                customer_email: customerDetails.email,
                customer_phone: String(customerDetails.mobile),
                customer_name: customerDetails.name
            },
            order_meta: {
                notify_url: "https://webhook.site/d057a7d4-c09a-405c-b44b-3067a1559a07",
                payment_methods: 'cc,dc,upi'
            },
            order_amount: orderAmount,
            order_id: generateOrderId(),
            order_currency: 'INR',
            order_note: 'This is my first Order',
        }
    };

    axios
    .request(options)
    .then(function (response) {
      return res.status(200).send({
        paymentSessionId: response.data.payment_session_id,
        paymentLink: response.data.payments.url,
        orderId: response.data.order_id,
        amount:response.data.order_amount,
        currency:response.data.order_currency,
      });
    })
    .catch(function (error) {
        console.error(error);
    });

  } catch (error) {
    res.status(500).send({
        message: error.message,
        success: false
    })
  }
};


export const checkStatus = async (req, res) => {
  const { orderId } = req.body; // Destructure orderId from the request body
  // console.log(orderId);

  try {
    const options = {
      method: 'GET',
      url: process.env.NODE_ENV === "production" ? `https://api.cashfree.com/pg/orders/${orderId}` :`https://sandbox.cashfree.com/pg/orders/${orderId}`,
      headers: {
        accept: 'application/json',
        'x-api-version': '2022-09-01',
        'x-client-id': app_id,
        'x-client-secret': secrect_key,
      },
    };

    const response = await axios.request(options); // Use async/await instead of .then()
    // console.log(response.data);

    if (response.data.order_status === 'PAID') {
      return res.json({ status: 'success' });
    } else if (response.data.order_status === 'ACTIVE') {
      return res.json({ status: 'active', sessionId: response.data.payment_session_id });
    } else {
      return res.json({ status: 'failure' }); // Send failure status
    }
  } catch (error) {
    console.error(error);
    return res.json({ status: 'error', message: error.message });
  }
};