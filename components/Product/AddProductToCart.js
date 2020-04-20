import React, { useState, useEffect } from "react";
import { Input } from "semantic-ui-react";
import { useRouter } from "next/router";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import cookie from "js-cookie";
import catchErrors from "../../utils/catchErrors";

function AddProductToCart({ productId, user }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timeout;
    if (success) {
      timeout = setTimeout(() => setSuccess(true), 3000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [success]);

  async function handleAddProductToCart() {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/cart`;
      const payload = {
        quantity,
        productId,
      };
      const token = cookie.get("token");
      const headers = { headers: { Authorization: token } };

      const response = await axios.put(url, payload, headers);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, window.alert);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Input
      type="number"
      min="1"
      placeholder="Quantity"
      onChange={(event) => setQuantity(Number(event.target.value))}
      value={quantity}
      action={
        user && success
          ? {
              color: "blue",
              content: "item added",
              icon: "plus cart",
              disabled: true,
            }
          : user
          ? {
              color: "orange",
              content: "Add to Cart",
              icon: "plus cart",
              loading: loading,
              disabled: loading,
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
