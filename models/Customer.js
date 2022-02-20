const mongoose = require("mongoose");
const User = require('./User');

const customerSchema = new mongoose.Schema({

    picture: {
        type: String,
    },
    address: {
        type: String,
        require: true,
        trim: true
    },
    city: {
        type: String,
        require: true,
        trim: true
    },
    cin: {
        type: Number,
        require: true,
        trim: true
    },
    orders: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Order',
        },
    ],

},

    { timestamps: true },


);

module.exports = User.discriminator("Customer", customerSchema)