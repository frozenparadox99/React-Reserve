import React, { useState } from "react";

import CartItemList from "../components/Cart/CartItemList";
import CartSummary from "../components/Cart/CartSummary";
import { Segment } from "semantic-ui-react";
import { parseCookies } from "nookies";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import cookie from "js-cookie";
import catchErrors from "../utils/catchErrors";

function Cart({ products, user }) {
  const [cartProducts, setCartProducts] = useState(products);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(products);

  async function handleRemoveFromCart(productId) {
    const url = `${baseUrl}/api/cart`;
    const token = cookie.get("token");
    const payload = {
      params: { productId },
      headers: { Authorization: token },
    };

    const response = await axios.delete(url, payload);
    setCartProducts(response.data);
  }

  async function handleCheckout(paymentData) {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/checkout`;
      const token = cookie.get("token");
      const payload = { paymentData };
      const headers = { headers: { Authorization: token } };
      const response = await axios.post(url, payload, headers);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, window.alert);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Segment loading={loading}>
      <CartItemList
        handleRemoveFromCart={handleRemoveFromCart}
        products={cartProducts}
        user={user}
        success={success}
      />
      <CartSummary
        handleCheckout={handleCheckout}
        products={cartProducts}
        success={success}
      />
    </Segment>
  );
}

Cart.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);

  if (!token) {
    return { products: [] };
  }

  const url = `${baseUrl}/api/cart`;
  const payload = { headers: { Authorization: token } };
  const response = await axios.get(url, payload);
  console.log(response.data);
  return { products: response.data };
};

export default Cart;
