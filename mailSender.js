const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {},
});

const mailOptions = {
  from: "nrj6670@gmail.com",
  to: "nrjs1997@gmail.com",
  subject: "Test mail",
  text:
    "This is a test email.If you received this email then the test was successful",
};

transporter.sendMail(mailOptions, (err, response) => {
  if (err) {
    console.log(err);
  } else {
    console.log(response);
  }
});
