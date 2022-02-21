const mongoose = require("mongoose");

const ItemOrderProductSchema = new mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        },
        qte: {
            type: Number,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
});

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Types.ObjectId,
            ref: 'Customer',
        },
        ref: {
            type: String,
            trim: true,
            require: true,
        },
        priceTotal: {
            type: String,
            trim: true,
            require: true,
        },
        qteTotal: {
            type: Number,
            trim: true,
            require: true,
        },
        pay: {
            type: Boolean,
            default: false
        },
        products: [ItemOrderProductSchema],
    },
    { timestamps: true}

);

module.exports = mongoose.model('Order',orderSchema );