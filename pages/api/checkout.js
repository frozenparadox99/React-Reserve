import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import Cart from "../../models/Cart";
import calculateCartTotal from "../../utils/calculateCartTotal";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { paymentData } = req.body;

  try {
    // 1) Verify and get userid from token
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // 2) Find the cart based on the user id and populate it
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product",
    });
    // 3) Calculate the cart total from cart products
    const { cartTotal, stripeTotal } = calculateCartTotal(cart.products);
    // 4) Get email from payment data and see if email is linked with existing stripe customer
    const prevCustomer = await stripe.customers.list({
      email: paymentData.email,
      limit: 1,
    });
    const isExistingCustomer = prevCustomer.data.length > 0;
    // 5) If not existing customer, create them based on their email
    let newCustomer;
    if (!isExistingCustomer) {
      newCustomer = await stripe.customers.create({
        email: paymentData.email,
        source: paymentData.id,
      });
    }

    const customer =
      (isExistingCustomer && prevCustomer.data[0].id) || newCustomer.id;
    // 6) Create charge with total, send receipt email
    const charge = await stripe.charges.create(
      {
        currency: "usd",
        amount: stripeTotal,
        receipt_email: paymentData.email,
        customer,
        description: `Checkout | ${paymentData.email} | ${paymentData.id}`,
      },
      {
        idempotency_key: uuidv4(),
      }
    );
    // 7) Add order data to database

    // 8) Clear products in cart
    // 9) Send success response
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing charge");
  }
};
