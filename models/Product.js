const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,

    },
    description: {
        type: String,
        trim: true,
        required: true,
    }
});

const productSchema = new mongoose.Schema({

    ref: {
        type: String,
        require: true,
        unique: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    Qte: {
        type: Number,
        require: true
    },
    subcategory: {
        type: mongoose.Types.ObjectId,
        ref: "SubCategory",
    },

    galleries: [GallerySchema],
},

    { timestamps: true }

);

module.exports = mongoose.model("Product", productSchema)
