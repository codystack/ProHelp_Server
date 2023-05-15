import Support from "../model/Support.model.js";
import { v4 } from "uuid";
import { sendSupportEmail } from "./mailer.js";
import User from "../model/User.model.js";
import Alert from "../model/Alert.model.js";
// import SupportModel from "../model/Support.model";

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

export async function addSupport(req, res) {
  try {
    const { purpose, message, user } = req.body;
    const { email } = user;

    const em = await User.findOne({ email }); // check if a user with the same email exists in the database

    if (!em)
      return res.status(404).json({
        success: false,
        message: "The email does not exist on this platform!",
      });
    //Generate a ticket number
    const ticketId = v4();
    const support = new Support({
      purpose: purpose,
      message: message,
      user: user,
      ticket: ticketId,
    });

    // return save result as a response
    support
      .save()
      .then(async (result) => {
        //Now send email here
        sendSupportEmail(email, ticketId, purpose).then((val) => {
          res.status(200).send({
            success: true,
            message: "Request received! Check your email for your ticket ID ",
          });
        });
      })
      .catch((error) =>
        res.status(500).send({ success: false, message: error })
      );
  } catch (error) {
    console.log("MERROR ", error);
    return res
      .status(404)
      .send({ success: false, message: "Authentication error" });
  }
}

export async function addAlert(type, message, userId, user) {
  try {
    const em = await User.findOne({ _id: userId }); // check if a user exists in the database

    if (!em)
      return res.status(404).json({
        success: false,
        message: "Account does not exist on this platform!",
      });

    const alert = new Alert({
      type: type,
      message: message,
      user: user,
      userId: userId,
    });

    // return save result as a response
    alert
      .save()
      .then(async (result) => {
        console.log("Alert added successfully");
        // res.status(200).send({
        // 	success: true,
        // 	message:
        // 		"Request rerceived. check your email for your ticket ID ",
        // });
      })
      .catch((error) =>
        res.status(500).send({ success: false, message: error })
      );
  } catch (error) {
    console.log("MERROR ", error);
    return res
      .status(404)
      .send({ success: false, message: "Authentication error" });
  }
}

export async function getAllFreelancers(req, res) {
  const { email } = req.params;
  try {
    if (!email)
      return res
        .status(404)
        .send({ success: false, message: "User does not exist" });

    User.findOne({ email: email }).then((user) => {
      if (user.accountType === "freelancer") {
        User.find({ accountType: "freelancer", email: { $ne: email } })
          .then((val) => {
            let emptArr = [];

            val.forEach((element) => {
              const { password, ...rest } = Object.assign({}, element.toJSON());
              emptArr.push(rest);
            });

            res.status(200).send({
              success: true,
              message: "Operation successful",
              data: emptArr,
            });
          })
          .catch((error) => {
            console.log("ERROR LOOg >> ", error);
            res.status(500).send({
              success: false,
              message: "An error occurred",
            });
          });
      } else {
        User.find({ accountType: "freelancer" })
          .then((val) => {
            let emptArr = [];

            val.forEach((element) => {
              const { password, ...rest } = Object.assign({}, element.toJSON());
              emptArr.push(rest);
            });

            res.status(200).send({
              success: true,
              message: "Operation successful",
              data: emptArr,
            });
          })
          .catch((error) => {
            console.log("ERROR LOOg >> ", error);
            res.status(500).send({
              success: false,
              message: "An error occurred",
            });
          });
      }
    });
  } catch (error) {
    console.log("ERROR OCCURED >. ", error);
    return res.status(404).send({ error: "Cannot Find User Data" });
  }
}

export async function getAllRecruiters(req, res) {
  const { email } = req.params;
  try {
    if (!email)
      return res
        .status(404)
        .send({ success: false, message: "User does not exist" });

    User.findOne({ email: email }).then((user) => {
      if (user.accountType === "recruiter") {
        User.find({ accountType: "recruiter", email: { $ne: email } })
          .then((val) => {
            let emptArr = [];

            val.forEach((element) => {
              const { password, ...rest } = Object.assign({}, element.toJSON());
              emptArr.push(rest);
            });

            res.status(200).send({
              success: true,
              message: "Operation successful",
              data: emptArr,
            });
          })
          .catch((error) => {
            console.log("ERROR LOOg >> ", error);
            res.status(500).send({
              success: false,
              message: "An error occurred",
            });
          });
      } else {
        User.find({ accountType: "recruiter" })
          .then((val) => {
            let emptArr = [];

            val.forEach((element) => {
              const { password, ...rest } = Object.assign({}, element.toJSON());
              emptArr.push(rest);
            });

            res.status(200).send({
              success: true,
              message: "Operation successful",
              data: emptArr,
            });
          })
          .catch((error) => {
            console.log("ERROR LOOg >> ", error);
            res.status(500).send({
              success: false,
              message: "An error occurred",
            });
          });
      }
    });
  } catch (error) {
    console.log("ERROR OCCURED >. ", error);
    return res
      .status(404)
      .send({ success: false, message: "Cannot Find User Data" });
  }
}

export async function saveWishlist(req, res) {
  const { guestId, guestName, userId } = req.body;
  try {
    if (!userId)
      res
        .status(404)
        .send({ success: false, message: "Account does not exist" });

    const user = await User.findById(userId);
    const alreadyAdded = user.savedPros.find((id) => id.toString() === guestId);
    if (alreadyAdded) {
      let usr = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { savedPros: guestId },
        },
        { new: true }
      );
      return res.status(200).send({
        success: false,
        message: "Successfully unliked " + guestName,
        data: usr,
      });
    } else {
      let usr = await User.findByIdAndUpdate(
        userId,
        {
          $push: { savedPros: guestId },
        },
        { new: true }
      );
      return res.status(200).send({
        success: false,
        message: "Successfully liked " + guestName,
        data: usr,
      });
    }
  } catch (error) {
    console.log("ERROR LIKING >>> ", error);
    throw new Error(error);
  }
}

export async function getLikedUsers(req, res) {
  const { email } = req.params;
  try {
    if (!email)
      res
        .status(404)
        .send({ success: false, message: "Account does not exist" });

    User.findOne({ email: email })
      .then((user) => {
        console.log("STR ARR ", `${user.savedPros}`);
        const stringArray = user.savedPros.map((objectId) =>
          objectId.toString()
        );
        console.log("SAVED PROS  ", user.savedPros.toString());
        console.log("STR ARR ", stringArray);

        User.find({ _id: { $in: stringArray } })
          .then((rs) => {
            console.log("STR RES ", rs);
            res
              .status(200)
              .send({ success: true, message: "Success", data: rs });
          })
          .catch((error) => console.log("ERR >> ", error));
      })
      .catch((err) => console.log("ERRORRO >> ", err));
  } catch (error) {
    throw new Error(error);
  }
}

export async function searcher(req, res) {
  // const { key } = req.params;
  try {
    let data = await User.find({
      $or: [
        { "bio.fullname": { $regex: req.params.key } },
        { "experience.company": { $regex: req.params.key } },
        { "experience.region": { $regex: req.params.key } },
        { "experience.country": { $regex: req.params.key } },
        { "experience.workType": { $regex: req.params.key } },
        { "experience.role": { $regex: req.params.key } },
        { "education.school": { $regex: req.params.key } },
        { "education.degree": { $regex: req.params.key } },
        { "education.course": { $regex: req.params.key } },
        { "skills.name": { $regex: req.params.key } },
        { accountType: { $regex: req.params.key } },
      ],
    });

    res.status(200).send({
      success: true,
      message: "search success",
      data: data,
    });
  } catch (error) {
    throw new Error(error);
  }
}
