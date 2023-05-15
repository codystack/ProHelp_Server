import nodemailer from "nodemailer";
import Mailgen from "mailgen";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "info.prohelpng@gmail.com", // process.env.MAILER_ID, //"info.prohelpng@gmail.com",
    pass: "anwabldujrrjfcbi", //process.env.MAILER_PASSWORD, ///"anwabldujrrjfcbi",
  },
});

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js",
  },
});

export const registerMail = async (req, res) => {
  const { userEmail, subject, message } = req.body;

  let msg = {
    from: process.env.MAILER_ID,
    to: userEmail,
    subject: subject || "Registration successful!",
    html: emailBody,
  };

  transporter
    .sendMail(msg)
    .then(() => {
      return subject
        .status(200)
        .send({ success: true, message: "Email sent successfully" });
    })
    .catch((error) => res.status(500).send({ success: false }));
};

export const sendVerificationCode = async (userEmail, verificationCode) => {
  // let message, subject;

  // var mail = {
  // 	body: {
  // 		name: "Dummy user",
  // 		intro:
  // 			message ||
  // 			"Welcome to ProHelp! We're very excited to have you on board \n" +
  // 				verificationCode,
  // 		outro: "Need our help? Contact our customer support",
  // 	},
  // };

  // var emailBody = MailGenerator.generate(mail);

  let msg = {
    from: process.env.MAILER_ID,
    to: userEmail,
    subject: "Account Verification",
    html:
      `<p>Welcome to <strong>ProHelp</strong>! We're very excited to have you on board. <br/>Verification Code </p>` +
      verificationCode,
  };

  // Send the email message
  //   const info = await transporter.sendMail(msg);
  //   console.log(`Email sent: ${info.messageId}`);
  return transporter.sendMail(msg);
  // .then((res) => {
  // console.log(`EMAIL SENT RESPONSE:: ${verificationCode} `, res.response);
  // 	// return res.response
  // 	// 	.status(200)
  // 	// 	.send({ success: true, message: "Email sent successfully" });
  // })
  // .catch((error) => console.log("error: ", error));
};

export const sendSupportEmail = async (userEmail, ticketNo, title) => {
  let msg = {
    from: process.env.MAILER_ID,
    to: userEmail,
    subject: title,
    html:
      `<p>Thank you for reaching out to us! We're here to help. <br/>Below is your ticket ID </p>` +
      ticketNo,
  };

  // Send the email message
  //   const info = await transporter.sendMail(msg);
  //   console.log(`Email sent: ${info.messageId}`);
  transporter
    .sendMail(msg)
    .then((res) => {
      console.log(`EMAIL SENT RESPONSE:: ${ticketNo} `, res.response);
      // return res.response
      // 	.status(200)
      // 	.send({ success: true, message: "Email sent successfully" });
    })
    .catch((error) => console.log("error: ", error));
};
