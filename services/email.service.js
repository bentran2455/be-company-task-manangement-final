const emailjs = require("@emailjs/nodejs");
require("dotenv").config();

emailjs.init({
  publicKey: process.env.EMAIL_PUBLIC_KEY,
  privateKey: process.env.EMAIL_PRIVATE_KEY,
});

const sendEmail = () => {
  emailjs.send("service_0mqjg75", "template_fj0q25s", {}).then(
    (response) => {
      console.log("SUCCESS!", response.status, response.text);
    },
    (err) => {
      console.log("FAILED...", err);
    }
  );
};

module.exports = { sendEmail };
