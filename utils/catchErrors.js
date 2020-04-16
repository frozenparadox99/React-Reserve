function catchErrors(error, displayError) {
  let errorMsg;
  if (error.response) {
    // The request was made but the status code aint perfect
    errorMsg = error.response.data;
    console.log("ERROR RESPONSE", errorMsg);

    if (error.response.data.error) {
      errorMsg = error.response.data.error.message;
      console.log("ERROR RESPONSE", errorMsg);
    }
  } else if (error.request) {
    // No response recieved
    errorMsg = error.request;
    console.log("ERROR REQUEST", errorMsg);
  } else {
    // Something else happened
    errorMsg = error.message;
    console.log("Error msg", errorMsg);
  }

  displayError(errorMsg);
}

export default catchErrors;
