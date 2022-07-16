require("dotenv").config();
const { createTransport } = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const generateAuth = () => {
  const client = createTransport(
    smtpTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    })
  );

  client.sendMail(
    {
      from: "woowenjun99@gmail.com",
      to: "E0773636@u.nus.edu",
      subject: "Testing 123",
      text: "Hi",
    },
    (error, info) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(info);
    }
  );
};

generateAuth();
