import { Router } from "express";
const router = Router();

/** import all controllers */
import * as controller from '../controllers/authController.js';
import * as appController from '../controllers/appController.js';
import { registerMail } from '../controllers/mailer.js'
import Auth, { localVariables } from '../middleware/auth.js';



/** POST Methods */
router.route('/register').post(controller.register); // register user
// router.route('/registerMail').post(registerMail); // send the email
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route('/login').post(controller.login); // login in app
router.route('/forgotPassword').post(controller.forgotPassword); // forgot password send email
router.route('/support').post(Auth, appController.addSupport);
router.route('/auth/google').post(controller.getGoogleParams);



/** GET Methods */
router.route('/users').get(controller.getAllUsers)
router.route('/user/:email').get(Auth, controller.getUser) // user with email
router.route('/freelancers/:email').get(Auth, appController.getAllFreelancers) // freelancer with email
router.route('/recruiters/:email').get(Auth, appController.getAllRecruiters) // freelancer with email
// router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP) // generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) // verify generated OTP
router.route('/resendOTP').get(controller.resendOTP, ) // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession) // reset all the variables
router.route('/logout').get(Auth, controller.logout); //Log user out
router.route('/search/:key').get(Auth, appController.searcher); //Search endpoint
router.route('/users/savedPros/:email').get(Auth, appController.getLikedUsers); //Log user out

/** PUT Methods */
router.route('/updateuser/:id').put(Auth, controller.updateUser); // is use to update the user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password
router.route('/likeUser').put(Auth, appController.saveWishlist);


export default router;