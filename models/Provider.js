const mongoose = require("mongoose");
const User = require('./User');

const providerSchema = new mongoose.Schema({

    matricule: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        minlength: 6,
    },
    company: {
        type: String,
        require: true,
        trim: true
    },
    service: {
        type: String,
        require: true,
        trim: true
    },

},

    { timestamps: true },


);

module.exports = User.discriminator("Provider", providerSchema)