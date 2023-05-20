import User from "../model/User.model.js";

export const encode = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    const payload = {
      userId: user._id,
      username: user.email,
    };

    const authToken = jwt.sign(
      payload,
      user.authType === "google"
        ? process.env.GOOGLE_AUTH_CLIENT_SECRET
        : process.env.JWT_SECRET
    );

    req.authToken = authToken;

    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.error });
  }
};
