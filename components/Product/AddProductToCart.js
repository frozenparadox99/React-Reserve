import React, { useState } from "react";
import { Input } from "semantic-ui-react";
import { useRouter } from "next/router";
import axios from "axios ";
import baseUrl from "../../utils/baseUrl";

function AddProductToCart({ productId, user }) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  async function handleAddProductToCart() {
    const url = `${baseUrl}/api/cart`;
    const payload = {
      quantity,
      productId,
    };
  }

  return (
    <Input
      type="number"
      min="1"
      placeholder="Quantity"
      onChange={(event) => setQuantity(Number(event.target.value))}
      value={quantity}
      action={
        user
          ? {
              color: "orange",
              content: "Add to Cart",
              icon: "plus cart",
              onClick: handleAddProductToCart,
            }
          : {
              color: "blue",
              content: "Sign up to purchase",
              icon: "signup",
              onClick: () => router.push("/signup"),
            }
      }
    />
  );
}

export default AddProductToCart;
