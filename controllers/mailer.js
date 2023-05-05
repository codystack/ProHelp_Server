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

	var email = {
		body: {
			name: "Dummy user",
			intro:
				message ||
				"Welcome to ProHelp! We're very excited to have you on board",
			outro: "Need our help? Contact our customer support",
		},
	};

	// var emailBody = MailGenerator.generate(email);

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
	//   // Define the email message
	//   const message = {
	//     from: 'your_email@gmail.com',
	//     to: email,
	//     subject: 'Verify Your Email Address',
	//     text: `Your verification code is: ${verificationCode}`,
	//     html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
	//   };
	let message, subject;

	var mail = {
		body: {
			name: "Dummy user",
			intro:
				message ||
				"Welcome to ProHelp! We're very excited to have you on board \n" +
					verificationCode,
			outro: "Need our help? Contact our customer support",
		},
	};

	var emailBody = MailGenerator.generate(mail);

	let msg = {
		from: process.env.MAILER_ID,
		to: userEmail,
		subject: "Registration successful!",
		html: `<p>Welcome to <strong>ProHelp</strong>! We're very excited to have you on board. <br/>Verification Code </p>` + verificationCode,
	};

	// Send the email message
	//   const info = await transporter.sendMail(msg);
	//   console.log(`Email sent: ${info.messageId}`);
	transporter
		.sendMail(msg)
		.then((res) => {
		console.log(`EMAIL SENT RESPONSE:: ${verificationCode} `, res.response);
			// return res.response
			// 	.status(200)
			// 	.send({ success: true, message: "Email sent successfully" });
		})
		.catch((error) => console.log("error: ", error));
};
