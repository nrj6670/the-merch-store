import { API } from "../../backend";

//signup
export const signup = (userData) => {
  return fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (response.status === 409) {
        return { error: true, status: 409 };
      }
      return { success: true, status: 201 };
    })
    .catch((error) => {
      return { error: true, status: 400 };
    });
};

//signin
export const signin = (userData) => {
  return fetch(`${API}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (response.status === 401 || response.status === 400) {
        return { error: "account not found", status: 401 };
      }
      return response.json();
    })
    .catch((error) => {
      return error.json();
    });
};

//authenticate function :- to store user data into localstorage
export const authenticate = (data) => {
  if (typeof window !== undefined) {
    localStorage.setItem("jwt", JSON.stringify(data));
  }
};

//signout
export const signout = () => {
  if (typeof window !== undefined) {
    localStorage.removeItem("jwt");

    return fetch(`${API}/signout`, {
      method: "GET",
    })
      .then((response) => {
        return { success: "SIGNED OUT SUCCESSFULLY" };
      })
      .catch((error) => {
        return error.json();
      });
  }
};

//check authentication
export const isAuthenticated = () => {
  if (typeof window === undefined) {
    return false;
  }

  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};
