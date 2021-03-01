import { API } from "../../backend";

export const paymentIntent = (data) => {
  return fetch(`${API}/createPaymentIntent`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      return await response.json();
    })
    .catch((error) => {
      console.log(error);
    });
};
