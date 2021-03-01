exports.passwordValidator = (value) => {
  if (value.length <= 6) {
    return Promise.reject("Password must contain atleast 7 characters");
  }

  if (value.toLowerCase().includes("password")) {
    return Promise.reject("Password cannot contain keyword 'password'.");
  }
};
