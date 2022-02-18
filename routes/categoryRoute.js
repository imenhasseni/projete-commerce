const route = require('express').Router();
const categoryController = require('../controllers/categoryController');


route.post('/createCategory', categoryController.createCategory)
route.get('/allCategory', categoryController.allCategory)
route.get('/categoryById/:id', categoryController.categoryById)
route.get('/categoryByName', categoryController.categoryByName)
route.put('/updateCategory/:id', categoryController.updateCategory)
route.delete('/deleteCategory/:id', categoryController.deleteCategory)

module.exports = route;