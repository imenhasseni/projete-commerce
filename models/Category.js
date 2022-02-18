const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        require: true,
        unique: true,
        trim: true

    },
    description: {
        type: String,
        require: true
    },
    subCategories: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'SubCategory',
        },
    ],

},

    { timestamps: true },


);

module.exports = mongoose.model("Category", categorySchema)

