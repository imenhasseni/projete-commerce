const route = require('express').Router();
const authentificationController = require('../controllers/authentificationController');
const multer = require('../middlwares/uplodImage');

//const check_auth = require('../middlwares/check_authentication');

const passport = require('passport');
require('../middlwares/passport_authentication').passport; //as strategy in passport


route.post('/registerCustomer', multer.single('image'), authentificationController.registerCustomer);

route.get('/verify-now/:verificationCode', authentificationController.verifyEmail);

route.post('/login', authentificationController.login);

// 1ere methode avec modle jwt
// route.get('/profile', check_auth, authentificationController.profile)
// 2eme methode profile avec les modules passport et passport-jwt
route.get('/profile', passport.authenticate('jwt', { session: false }), authentificationController.profile);

route.put('/updateProfile', passport.authenticate('jwt', { session: false }), authentificationController.updateProfile);



module.exports = route;