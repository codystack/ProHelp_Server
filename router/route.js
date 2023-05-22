import { Router } from "express";
const router = Router();

/** import all controllers */
import * as controller from '../controllers/authController.js';
import * as appController from '../controllers/appController.js';
import * as chatController from '../controllers/chatController.js';
import { registerMail } from '../controllers/mailer.js'
import Auth, { localVariables } from '../middleware/auth.js';


                        // ***** AUTHENTICATION ***** //
router.route('/register').post(controller.register); // register user
router.route('/login').post(controller.login); // login in app
router.route('/forgotPassword').post(controller.forgotPassword); // forgot password send email
router.route('/auth/google').post(controller.getGoogleParams);
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) // verify generated OTP
router.route('/resendOTP').get(controller.resendOTP, ) // verify generated OTP
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password



                        // ***** CHAT ***** //
router.route('/chat/initiate/:email').post(Auth, chatController.initiateChat);
router.route('/chat/all/:email').get(Auth, chatController.getChatsByUser);
router.route('/chat/message/new/:email').post(Auth, chatController.postMessage)
router.route('/chat/message/all/:email').get(Auth, chatController.getConversationByRoomId)
router.route('/chat/message/read/:email').put(Auth, chatController.markAsRead); //Set mark as read



                        // ***** ACCOUNT ***** //
router.route('/users').get(controller.getAllUsers)
router.route('/user/:email').get(Auth, controller.getUser) // user with email
router.route('/freelancers/:email').get(Auth, appController.getAllFreelancers) // freelancer with email
router.route('/recruiters/:email').get(Auth, appController.getAllRecruiters) // freelancer with email
router.route('/createResetSession').get(controller.createResetSession) // reset all the variables
router.route('/logout/:email').get(Auth, controller.logout); //Log user out
router.route('/updateuser/:email').put(Auth, controller.updateUser); // is use to update the user profile
router.route('/likeUser/:email').put(Auth, appController.saveWishlist); // Like/Unlike user
router.route('/connection/:email').put(Auth, appController.saveConnection); //Add connection after payment
router.route('/users/savedPros/:email').get(Auth, appController.getLikedUsers); //get saved pros/recruiters for user
router.route('/users/connections/:email').get(Auth, appController.getConnections); //get all connections of a user
router.route('/review/create/:email').post(Auth, appController.saveReview); //save a new review
router.route('/review/delete/:email').put(Auth, appController.deleteReview); //Delete/Take down a review
router.route('/review/byUser/:email').get(Auth, appController.getReviewsByUser); //get all user's reviews
router.route('/review/reply/:email').put(Auth, appController.replyReview); //reply a specific review


                        // ***** APPLICATION ***** //
router.route('/search/:key').get(appController.searcher); //Search endpoint
router.route('/support/:email').post(Auth, appController.addSupport);


                


export default router;