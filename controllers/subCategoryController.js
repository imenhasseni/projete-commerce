const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');

//create SubCategory

createSubCategory = async (req, res) => {
    try {
        const newSubCategory = new SubCategory(req.body);
        await newSubCategory.save();
        await Category.findByIdAndUpdate(req.body.category,{
            $push: { subCategories: newSubCategory},
        });

        res.status(201).json({
            message: " SubCategory successfully created. ",
            data: newSubCategory,
            success: true
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }
}

//get all SubCategory

allSubCategory = async (req, res) => {
    try {
        // 3eme etape de relation one to many .populate('category)
        const listSubCategory = await SubCategory.find({}).populate('category').populate('products');
        res.status(200).json({
            message: "List of SubCategory",
            data: listSubCategory,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

//get subCategory by Id

subCategoryById = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById({ _id: req.params.id }).populate('category').populate('products');
        res.status(201).json({
            message: "SubCategory by id",
            data: subCategory,
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }
}

//get subCategory by Name

subCategoryByName = async (req, res) => {
    try {
        const subCategory = await SubCategory.find({ ref: req.query.ref }).populate('category').populate('products');
        res.status(201).json({
            message: "SubCategory by name",
            data: subCategory,
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }

}

// get subCategory by category

subCategoryByCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.find({category: req.query.category}).populate('category').populate('products');
        res.status(200).json({
            message: 'SubCategory by category founded',
            status:200,
            data: subCategory,
            success: true
            
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }
}

// update subCategory

updatesubCategory = async (req, res) => {
    try {
        await SubCategory.updateOne({ _id: req.params.id }, (req.body));
        res.status(201).json({
            message: " SubCategory updated! ",
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }
}
// delete subCategory

deletesubCategory = async (req, res) => {
    try {
        await SubCategory.deleteOne({ _id: req.params.id });
        res.status(201).json({
            message: " SubCategory deleted! ",
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }

}
module.exports = { createSubCategory, allSubCategory, subCategoryById, subCategoryByName, subCategoryByCategory, updatesubCategory, deletesubCategory }
