const Product = require("../models/Product");
const SubCategory = require("../models/SubCategory");

//create product

createProduct = async (req, res) => {
    try {
        req.body['galleries'] = req.files.length <= 0
            ? []
            : req.files.map(function (file) {
                return { name: file.filename, description: 'add prod' };
            });

        const newProduct = new Product(req.body);
        const product = await newProduct.save();

        await SubCategory.findByIdAndUpdate(
            req.body.subcategory,
            { $push: { products: product } }
        );

        res.status(201).json({
            message: "created Product and push Product in subcategory successfully !",
            data: product,
            success: true
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }
}

//get all product

allProduct = async (req, res) => {
    try {
        // 3eme etape de relation one to many .populate('category)
        const listProduct = await Product.find({}).populate('subcategory');
        res.status(200).json({
            message: "List of Product",
            data: listProduct,
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }
}

//get Product by Id

productById = async (req, res) => {
    try {
        const product = await Product.findById({ _id: req.params.id }).populate('subcategory');
        res.status(201).json({
            message: "get Product by id",
            data: product,
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }
}

//get Product by Name

productByName = async (req, res) => {
    try {
        const product = await Product.find({ ref: req.query.ref }).populate('subcategory');
        res.status(201).json({
            message: " get Product by name",
            data: product,
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }

}
// get product by category
productByCategory = async (req, res) => {
    try {
        const product = await Product.find({ category: req.query.category }).populate('subcategory');
        res.status(201).json({
            message: " get Product by category",
            data: product,
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }
}

// update Product

updateProduct = async (req, res) => {
    try {
        await Product.updateOne({ _id: req.params.id }, (req.body));
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
// delete Product

deleteProduct = async (req, res) => {
    try {
        await Product.deleteOne({ _id: req.params.id });
        res.status(201).json({
            message: "product deleted !",
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }

}
module.exports = { createProduct, allProduct, productById, productByName, updateProduct, deleteProduct, productByCategory }
