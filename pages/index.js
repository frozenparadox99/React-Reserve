import React, { useEffect } from "react";
import axios from "axios";

function Home({ products }) {
  console.log(products);
  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    const url = "http://localhost:3000/api/products";
    const response = await axios.get(url);
    // console.log(response.data);
  }

  return <>home</>;
}

Home.getInitialProps = async () => {
  // Fetch data from the server
  const url = "http://localhost:3000/api/products";
  const response = await axios.get(url);

  //Return data as an object
  return { products: response.data };
  // note: This object is merged with existing props
};

export default Home;
