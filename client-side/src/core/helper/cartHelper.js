export const addToCart = (product) => {
  if (typeof window !== undefined) {
    let cart = [];
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    const itemExists = cart.find(
      (cartItem) =>
        cartItem._id === product._id && cartItem.size === product.size
    );

    if (!itemExists) {
      cart.push({ ...product, count: 1 });
    } else {
      cart.map((cartItem) => {
        if (product._id === cartItem._id) {
          cartItem.count += 1;
        }
      });
    }
    return localStorage.setItem("cart", JSON.stringify(cart));
  }
};

export const loadCart = () => {
  if (typeof window !== undefined) {
    let cart = [];
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    return cart;
  }
};

export const changeQuantity = (operation, product) => {
  if (typeof window !== undefined) {
    let cart = [];

    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    for (let i = 0; i < cart.length; i++) {
      if (product._id === cart[i]._id && product.size === cart[i].size) {
        if (operation === "increase") {
          cart[i].count += 1;
          break;
        } else {
          if (product.count !== 1) {
            cart[i].count -= 1;
          }
        }
        break;
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

export const removeItem = (product) => {
  if (typeof window !== undefined) {
    let cart = [];
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    cart.map((item, index) => {
      if (item._id === product._id && item.size === product.size) {
        cart.splice(index, 1);
      }
    });

    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

export const emptyCart = () => {
  let cart = [];
  if (typeof window !== undefined) {
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};
