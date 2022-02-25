const route = require('express').Router();
const authentificationController = require('../controllers/authentificationController');
const multer = require('../middlwares/uplodImage');

//const check_auth = require('../middlwares/check_authentication');

const passport = require('passport');
require('../middlwares/passport_authentication').passport; //as strategy in passport


route.post('/registerCustomer', multer.single('image'), authentificationController.registerCustomer);

route.get('/verify-now/:verificationCode', authentificationController.verifyEmail);

route.post('/login', authentificationController.login);

route.post('/tokenrefresh', passport.authenticate('jwt', { session: false }), authentificationController.tokenrefresh );
// 1ere methode avec module jwt
// route.get('/profile', check_auth, authentificationController.profile)
// 2eme methode profile avec les modules passport et passport-jwt
route.post('/profile', passport.authenticate('jwt', { session: false }), authentificationController.profile);

route.put('/updateProfile', passport.authenticate('jwt', { session: false }), authentificationController.updateProfile);

route.get('/forgetPassword', authentificationController.forgetPassword);

route.get('/reset/:resetPasswordToken', authentificationController.resetpassword);



module.exports = route;