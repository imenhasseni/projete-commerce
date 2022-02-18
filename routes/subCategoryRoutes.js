const route = require('express').Router();
const subCategoryController = require('../controllers/subCategoryController');


route.post('/createSubCategory', subCategoryController.createSubCategory)
route.get('/allSubCategory', subCategoryController.allSubCategory)
route.get('/subCategoryById/:id', subCategoryController.subCategoryById)
route.get('/subCategoryByName', subCategoryController.subCategoryByName)
route.get('/subCategoryByCategory', subCategoryController.subCategoryByCategory);
route.put('/updatesubCategory/:id', subCategoryController.updatesubCategory)
route.delete('/deletesubCategory/:id', subCategoryController.deletesubCategory)

module.exports = route;