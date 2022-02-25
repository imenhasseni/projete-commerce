const Customer = require('../models/Customer');
const bcrypt = require('bcrypt');
const { randomBytes } = require('crypto');
const { join } = require('path');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


const DOMAIN = process.env.APP_DOMAIN;
const SECRET = process.env.APP_SECRET;

//module de token 
const randtoken = require("rand-token");
// tab ou on met les refresh tokens
var RefreshTokens = [];


const nodemailer = require('nodemailer');


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
};

login = async (req, res) => {

    try {
        // 1 ere étape verifier email et compare password
        const { email, password } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'email not found !'
            });
        }
        if (user.verified === true) {
            const passwordCompare = bcrypt.compareSync(password, user.password);
            if (!passwordCompare) {
                return res.status(404).json({
                    status: 404,
                    message: 'password Incorrect !'
                });
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
            //creation de refresh token 
            // var refreshToken = randtoken.uid(256);
            // RefreshTokens[refreshToken]= user._id;
            var refreshToken = jwt.sign({ id: user._id }, SECRET, {
                expiresIn: 86400 // 24 hours
            });
            RefreshTokens[refreshToken] = user._id;

            const result = {
                email: user.email,
                user: user,
                token: token,
                expiresIn: 1,
                //affichage de refresh token
                //key : value
                refreshtoken: refreshToken,
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
};

tokenrefresh = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        console.log(req.user._id);
        console.log(RefreshTokens);
        console.log(RefreshTokens[refreshToken]);
        console.log("refresh egalite", RefreshTokens[refreshToken] == req.user._id);
        console.log("refresh", refreshToken in RefreshTokens);
        if (refreshToken in RefreshTokens /* && RefreshTokens[refreshTToken] == req.user._id */) {
            const token = jwt.sign(
                {
                    user: req.user,
                },
                SECRET,
                {
                    expiresIn: '7 days',
                }
            );
            res.status(200).json({
                accesstoken: token,
            });
        } else {
            res.status(401).json({
                message: error.message,
            })
        }
    } catch (error) {
        res.status('404').json({
            message: error.message,
        });
    }
};

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

forgetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email });
       // console.log(user);
        if (!user) {
            return res.status(400).json({
                message: "Email does not exist",
            });
        }
        const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: "2h" });
        //const updateuser = 
        await User.findOneAndUpdate(
            { email: email },
            { resetPasswordToken: token },
        );
        //console.log(updateuser);
        transporter.sendMail(
            {
                to: email,
                subject: "Forget Password",
                text: "Bonjourr mr",
                html: `<!DOCTYPE html>
                 <html lang="en">
                 <head>
                     <meta charset="UTF-8">
                     <meta http-equiv="X-UA-Compatible" content="IE=edge">
                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
                     <title>Document</title>
                 </head>
                 <body>
                 <a href="${DOMAIN}/reset/${token}">Reset Password </a>  
                 </body>
                 </html>`,
            },
            (err, info) => {
                 if(err){
                     console.log("error : ", err.message);
                 }else{
                     console.log("Email sent : ", info.response);
                 }
            }
           
        );
        return res.status(200).json({
            message: 'Success',
        });
    } catch (error) {
        res.status(400).json({
            message: "Hurrray! check your email address",
        });
 
    }
}

resetpassword = async (req, res) => {
    try {
        const resetPasswordToken = req.params.resetPasswordToken;

        if (resetPasswordToken) {
            //pour verifier date d'expiration de resetPasswordToken
            jwt.verify(resetPasswordToken,SECRET, async err => {
                if(err){
                    return res.json({
                        error: 'incorrect token or it is exprired',
                    });
                }
                const user = await User.findOne({
                    resetPasswordToken: resetPasswordToken,
                });

                user.password = bcrypt.hashSync(req.body.newPass, 10);
                user.save();

                return res.status(200).json({
                    message: 'password has been changed',
                });

            });
        }
    } catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
}

module.exports =
{
    registerCustomer,
    verifyEmail,
    login,
    tokenrefresh,
    profile,
    updateProfile,
    forgetPassword,
    resetpassword
    
}