import User from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import ENV from "../config.js";
import otpGenerator from "otp-generator";
import { sendVerificationCode } from "./mailer.js";
import admin from "firebase-admin";
import serviceAccount from "../middleware/serviceAccKey.json";
import express from "express";

const app = express();

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

/** middleware for verify user */
export async function verifyUser(req, res, next) {
	try {
		const { email } = req.method == "GET" ? req.query : req.body;

		// check the user existance
		let exist = await User.findOne({ email });
		if (!exist)
			return res
				.status(404)
				.send({ success: false, message: "Can not find user!" });
		next();
	} catch (error) {
		console.log("MERROR ", error);
		return res
			.status(404)
			.send({ success: false, message: "Authentication error" });
	}
}

/** POST: http://localhost:8080/api/register 
 * @param : {
  "password" : "admin123",
  "email": "example@gmail.com",
}
*/
export async function register(req, res) {
	try {
		const { password, email } = req.body;

		const em = await User.findOne({ email }); // check if a user with the same email exists in the database

		if (em)
			return res.status(400).json({
				success: false,
				message: "The email is already associated to an account.",
			});

		if (password) {
			bcrypt
				.hash(password, 10)
				.then((hashedPassword) => {
					const user = new User({
						password: hashedPassword,
						email,
					});

					// return save result as a response
					user.save()
						.then(async (result) => {
							//Now send email here
							let code = await generateOTP();
							sendVerificationCode(email, code).then((val) => {
								res.status(200).send({
									success: true,
									message:
										"An OTP code has been sent to your email. ",
								});
								//Now save the otp code here
								app.locals.otp = code;
							});
						})
						.catch((error) =>
							res
								.status(500)
								.send({ success: false, message: error })
						);
				})
				.catch((error) => {
					return res.status(500).send({
						success: false,
						message: "Enable to hashed password",
					});
				});
		}

		// Promise.all([checkEmailExists])
		// 	.then(() => {
		// 		if (password) {
		// 			bcrypt
		// 				.hash(password, 10)
		// 				.then((hashedPassword) => {
		// 					const user = new User({
		// 						password: hashedPassword,
		// 						email,
		// 					});

		// 					// return save result as a response
		// 					user.save()
		// 						.then(async (result) => {
		// 							//Now send email here
		// 							let code = await generateOTP();
		// 							sendVerificationCode(email, code).then(
		// 								(val) => {
		// 									res.status(201).send({
		// 										success: true,
		// 										message:
		// 											"An OTP code has been sent to your email. ",
		// 									});
		// 								}
		// 							);
		// 						})
		// 						.catch((error) =>
		// 							res
		// 								.status(500)
		// 								.send({ success: false, error })
		// 						);
		// 				})
		// 				.catch((error) => {
		// 					return res.status(500).send({
		// 						error: "Enable to hashed password",
		// 					});
		// 				});
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.log("ERROR", error);
		// 		return res
		// 			.status(500)
		// 			.send({ success: false, message: error?.message });
		// 	});
	} catch (error) {
		return res.status(500).send(error);
	}
}

export async function forgotPassword(req, res) {
	try {
		const { email } = req.body;

		const em = await User.findOne({ email }); // check if a user with the same email exists in the database

		if (!em)
			return res.status(400).json({
				success: false,
				message: "Email is not registered on this platform.",
			});
		let code = await generateOTP();
		sendVerificationCode(email, code).then((val) => {
			res.status(200).send({
				success: true,
				message: "An OTP code has been sent to your email. ",
			});
			//Now save the otp code here
			app.locals.otp = code;
		});
	} catch (error) {
		console.log("FORGOT-ERROR:: ", error);
		res.status(500).send({
			success: false,
			message: "An error occurred ",
		});
	}
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
	const { email, password } = req.body;

	try {
		User.findOne({ email })
			.then((user) => {
				bcrypt
					.compare(password, user.password)
					.then((passwordCheck) => {
						if (!passwordCheck)
							return res.status(400).send({
								error: "Incorrect user credentials. Try again.",
							});

						// create jwt token
						const token = jwt.sign(
							{
								userId: user._id,
								username: user.email,
							},
							process.env.JWT_SECRET,
							{ expiresIn: "24h" }
						);

						const { password, ...rest } = Object.assign(
							{},
							user.toJSON()
						);

						return res.status(200).send({
							message: "You have successfully logged in",
							success: true,
							token,
							data: rest,
						});
					})
					.catch((error) => {
						return res.status(400).send({
							success: false,
							message: "Password does not match",
						});
					});
			})
			.catch((error) => {
				return res.status(404).send({
					success: false,
					message: "User account does not exist",
				});
			});
	} catch (error) {
		return res.status(500).send({ error });
	}
}

export async function logout(req, res) {
	// if (app.locals.resetSession) {
	app.locals.resetSession = false; // reset session
	return res
		.status(200)
		.send({ success: true, message: "Logged out successfully" });
	// }
	// return res
	// 	.status(403)
	// 	.send({ success: false, message: "Session expired!" });
}

export async function getUser(req, res) {
	const { email } = req.params;

	try {
		if (!email)
			return res
				.status(501)
				.send({ success: false, message: "Invalid Username" });

		User.findOne({ email })
			.then((val) => {
				// if (!val)
				// 	return res.status(501).send({
				// 		success: false,
				// 		message: "Couldn't Find the User",
				// 	});
				/** remove password from user */
				// mongoose return unnecessary data with object so convert it into json
				const { password, ...rest } = Object.assign({}, val.toJSON());

				return res.status(200).send({
					success: true,
					message: "Operation successful",
					data: rest,
				});
			})
			.catch((error) => {
				console.log("ERROR GETTING USER:: >> ", error);
				return res
					.status(404)
					.send({ success: false, message: "Cannot Find User Data" });
			});

		// User.findOne({ email }, function (err, user) {
		// 	if (err) return res.status(500).send({ err });
		// 	if (!user)
		// 		return res
		// 			.status(501)
		// 			.send({success: false, message: "Couldn't Find the User" });

		// 	/** remove password from user */
		// 	// mongoose return unnecessary data with object so convert it into json
		// 	const { password, ...rest } = Object.assign({}, user.toJSON());

		// 	return res.status(200).send({success: true, message: "Operation successful", data: rest});
		// });
	} catch (error) {
		return res
			.status(404)
			.send({ success: false, message: "Cannot Find User Data" });
	}
}

export async function getAllUsers(req, res, next) {
	try {
		User.find({}, (err, users) => {
			if (err) {
				console.error(err);
				res.status(500).send("Error retrieving users from database");
			} else {
				req.users = users;
				next();
			}
		});

		res.send(req.users);
	} catch (error) {
		return res.status(404).send({ error: "Cannot Find User Data" });
	}
}

export async function updateUser(req, res) {
	try {
		const { id } = req.params;

		if (id) {
			const body = req.body;

			let usr = await User.findOneAndUpdate({ email: id }, body, {
				new: true,
			});

			/** remove password from user */
			// mongoose return unnecessary data with object so convert it into json
			const { password, ...rest } = Object.assign({}, usr.toJSON());

			// return res.status(200).send({
			// 	success: true,
			// 	message: "Operation successful",
			// 	data: rest,
			// });

			res.status(200).send({
				success: true,
				message: "Profile updated successfully!",
				data: rest,
			});
		} else {
			return res
				.status(404)
				.send({ success: false, message: "User does not exist!" });
		}
	} catch (error) {
		return res.status(403).send({ error });
	}
}

function generateOTP() {
	return otpGenerator.generate(6, {
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false,
	});
}

export async function resendOTP(req, res) {
	try {
		const { email } = req.query;
		app.locals.otp = null;
		let code = generateOTP();
		sendVerificationCode(email, code).then((val) => {
			res.status(200).send({
				success: true,
				message: "An OTP code has been sent to your email. ",
			});
			//Now save the otp code here
			app.locals.otp = code;
		});
	} catch (error) {
		res.status(400).send({
			success: false,
			message: "Failed to resend code. Check your network",
		});
		console.log("ERROR", error);
	}
}

export async function verifyOTP(req, res) {
	const { code, email } = req.query;
	console.log("OTP CODE", code);
	console.log("OTP CODE2", app.locals.otp);
	try {
		if (parseInt(app.locals.otp) === parseInt(code)) {
			app.locals.otp = null; // reset the OTP value
			app.locals.resetSession = true; // start session for reset password

			await User.updateOne({ isVerified: true }); //Verify user

			let user = await User.findOne({ email });

			// create jwt token
			const token = jwt.sign(
				{
					userId: user._id,
					username: user.email,
				},
				process.env.JWT_SECRET,
				{ expiresIn: "24h" }
			);

			return res.status(200).send({
				message: "Account verification successful!",
				success: true,
				token: token,
			});
		}
		return res.status(400).send({
			success: false,
			message: "The OTP code you entered is invalid",
		});
	} catch (error) {
		console.log("ERROR VERIFICATION", error);
		return res.status(401).send({ error });
	}
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
	if (app.locals.resetSession) {
		return res.status(201).send({ flag: app.locals.resetSession });
	}
	return res.status(403).send({ error: "Session expired!" });
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
	try {
		if (!app.locals.resetSession)
			return res
				.status(403)
				.send({ success: false, message: "Session expired!" });

		const { email, password } = req.body;

		try {
			User.findOne({ email })
				.then((user) => {
					bcrypt
						.hash(password, 10)
						.then((hashedPassword) => {
							User.updateOne(
								{ password: hashedPassword },
								function (err, data) {
									if (err) throw err;
									app.locals.resetSession = false; // reset session
									return res.status(200).send({
										success: true,
										message:
											"Password updated successfully",
									});
								}
							);
						})
						.catch((e) => {
							return res.status(500).send({
								error: "Enable to update password",
							});
						});
				})
				.catch((error) => {
					return res
						.status(404)
						.send({ error: "User does not exist" });
				});
		} catch (error) {
			return res.status(500).send({ error });
		}
	} catch (error) {
		return res.status(401).send({ error });
	}
}
