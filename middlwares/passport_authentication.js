const { Strategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const SECRET = process.env.APP_SECRET;
const User = require('../models/User');

//pour choisir format token 
var options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
};
// instance
passport.use(
    new Strategy(options, async ({ id }, done) => {
        // console.log('Now in middleware'); => pour voir si on est dans le middlwares
        try {
            const user = await User.findById(id);
            if (!user) {
                // done(null, "User not found")
                throw new Error('User not foound');
            }
            done(null, user);
            /* done.status(200).json({
                message: "user",
                data: user
            })*/
        } catch (error) {
            done(null, error.message)
        }
    })
);
