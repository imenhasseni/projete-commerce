const route = require('express').Router();
const orderController = require('../controllers/orderController');
const passport = require('passport');
require('../middlwares/passport_authentication').passport; 


route.post('/addOrder',passport.authenticate('jwt', { session: false }), orderController.addOrder);
route.get('/getOrderByCustomer', passport.authenticate('jwt', { session: false }), orderController.getOrderByCustomer);
route.get('/allOrders', passport.authenticate('jwt', { session: false }),orderController.allOrders);
route.put('/updateOrders',passport.authenticate('jwt', { session: false }), orderController.updateOrders);
route.delete('/deleteOrder/:id', passport.authenticate('jwt', { session: false }),orderController.deleteOrder);
module.exports = route;