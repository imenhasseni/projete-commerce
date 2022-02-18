const mongoose = require("mongoose");


const subCategorySchema = new mongoose.Schema({

    name: {
        type: String,
        require: true,
        unique: true,
        minlength: 6,
        trim: true

    },
    description: {
        type: String,
        require: true
    },

    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true
    },
    products: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Product'
        },
    ],

},

    { timestamps: true },


);

module.exports = mongoose.model("SubCategory", subCategorySchema)

