import React, { useEffect } from "react";
import axios from "axios";
import ProductList from "../components/Index/ProductList";
import baseUrl from "../utils/baseUrl";

function Home({ products }) {
  return <ProductList products={products} />;
}

Home.getInitialProps = async () => {
  // Fetch data from the server
  const url = `${baseUrl}/api/products`;
  const response = await axios.get(url);

  //Return data as an object
  return { products: response.data };
  // note: This object is merged with existing props
};

export default Home;
