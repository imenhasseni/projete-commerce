const Category = require("../models/Category")

//create category
createCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body)

        await newCategory.save()

        res.status(201).json({
            message: "Hurry! now category are successfully created.",
            data: newCategory,
            success: true
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }
}

//get all category
allCategory = async (req, res) => {
    try {
        const listCategories = await Category.find({}).populate('subCategories')
        res.status(201).json({
            message: "List of categories",
            data: listCategories,
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }
}

//get Category by Id

categoryById = async (req, res) => {
    try {
        const category = await Category.findById({ _id: req.params.id }).populate('subCategories');
        res.status(201).json({
            message: "category by id",
            data: category,
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }
}

//get Category by Name

categoryByName = async (req, res) => {
    try {
        const category = await Category.find({ name: req.query.name }).populate('subCategories');
        res.status(201).json({
            message: "category by name",
            data: category,
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }

}

// update Category
updateCategory = async (req, res) => {
    try {
        await Category.updateOne({ _id: req.params.id }, (req.body));
        res.status(201).json({
            message: "updated!",
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }

}
// delete Category

deleteCategory = async (req, res) => {
    try {
        await Category.deleteOne({ _id: req.params.id });
        res.status(201).json({
            message: "category deleted !",
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }

}
module.exports = { createCategory, allCategory, categoryById, categoryByName, updateCategory, deleteCategory }
