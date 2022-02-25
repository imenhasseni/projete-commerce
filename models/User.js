const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({

    fullname: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true

    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    phone: {
        type: Number,
        require: true,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        required: false
    },
    resetPasswordToken: {
        type: String,
        required: false,

    },
    resetPasswordExpiresIn: {
        type: Date,
        required: false,
    },

},

    { timestamps: true },


);

module.exports = mongoose.model("User", userSchema)

