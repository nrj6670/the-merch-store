import { API } from "../../backend";

export const getAllUserOrders = (userId, token) => {
  return fetch(`${API}/user/orders/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return console.log(error);
    });
};
