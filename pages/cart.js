import React, { useState } from "react";

import CartItemList from "../components/Cart/CartItemList";
import CartSummary from "../components/Cart/CartSummary";
import { Segment } from "semantic-ui-react";
import { parseCookies } from "nookies";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import cookie from "js-cookie";

function Cart({ products, user }) {
  const [cartProducts, setCartProducts] = useState(products);
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

  return (
    <Segment>
      <CartItemList
        handleRemoveFromCart={handleRemoveFromCart}
        products={cartProducts}
        user={user}
      />
      <CartSummary products={cartProducts} />
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
