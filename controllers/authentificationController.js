const Customer = require('../models/Customer');
const bcrypt = require('bcrypt');
const { randomBytes } = require('crypto');
const DOMAIN = process.env.APP_DOMAIN;
const { join } = require('path');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const SECRET = process.env.APP_SECRET;


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'imenhasseni1@gmail.com',
        pass: process.env.APP_PASSWORDEMAIL,
    },
});

registerCustomer = async (req, res) => {
    try {
        req.body["picture"] = req.file.filename;
        const password = bcrypt.hashSync(req.body.password, 8)
        const newCustomer = new Customer({
            ...req.body,
            password,
            verificationCode: randomBytes(6).toString('hex')
        })
        await newCustomer.save()
        res.status(200).json({
            message: "hurry! now user are successfuly created",
            data: newCustomer,
            success: true,
        })
        transporter.sendMail(
            {
                to: newCustomer.email,
                subject: 'welcome' + newCustomer.fullname,
                text: 'bonjour mr',
                html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <h2>Hello ${newCustomer.fullname}!</h2>
                    <p>We're glad to have you on board at ${newCustomer.email}</p>
                    <a href="${DOMAIN}verify-now/${newCustomer.verificationCode}">Verify now </a>
                </body>
                </html>`,
                attachments: [{
                    filename: req.file.filename,
                    path: "./storages/" + req.file.filename,
                    cid: 'test',
                },
                ],
            },
            (err, info) => {
                if (err) {
                    console.log('error : ', err.message);
                } else {
                    console.log('Email send : ', info.reponse);
                }
            }
        )
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

verifyEmail = async (req, res) => {
    try {

        const { verificationCode } = req.params;

        const user = await User.findOne({
            verificationCode,
        });
        console.log(user.fullname);
        user.verified = true;
        user.verificationCode = undefined;
        user.save();
        return res.sendFile(
            join(__dirname, "../Templates/verification_success.html")
        );

    } catch (error) {
        console.log(error.message);
        res.sendFile(join(__dirname, "../Templates/errors.html")
        );
    }
}

login = async (req, res) => {

    try {
        // 1 ere étape verifier email et compare password
        const { email, password } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            return res.
                status(404).json({ status: 404, message: 'email not found !' });
        }
        if (user.verified === true) {
            const passwordCompare = bcrypt.compareSync(password, user.password);
            if (!passwordCompare) {
                return res.status(404).json({ status: 404, message: 'password Incorrect !' });
            }

            // 2 eme étape creation de token
            const token = jwt.sign(
                {
                    id: user._id,
                    user: user,
                },
                SECRET,
                {
                    expiresIn: '7 days',
                }
                /* {expireIn: '24h'} */
            );
            const result = {
                email: user.email,
                user: user,
                token: token,
                expiresIn: 1,
            }

            return res.status(200).json({
                ...result,
                message: 'Hurray! You are now logged in .',
                success: true,
            });
        } else {
            return res.status(200).json({
                message: 'You are not verified',
                success: false,
            });
        }

    } catch (error) {
        res.status(404).json({ status: 404, message: error.message });
    }
}

profile = async (req, res) => {
    try {
        // console.log('hello')
        const user = req.user;
        res.status(200).json({
            user: user
        });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

updateProfile = async (req, res) => {
    try {

        await User.updateOne({ _id: req.user._id }, (req.body));
        res.status(201).json({
            message: "Profile Updated!",
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });

    }
}

module.exports =
{
    registerCustomer,
    verifyEmail,
    login,
    profile,
    updateProfile
}