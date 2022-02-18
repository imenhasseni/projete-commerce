const jwt = require('jsonwebtoken');
const SECRET = process.env.APP_SECRET;


check_auth = async (req, res, next) => {

    try {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).json({ message: 'No token' });
        }
        const decord = jwt.verify(token, SECRET);
        // console.log(decord); les données afficher dans le cnsole
        res.status(200).json({
            message: 'Auth',
            data: decord,
        });
        next();
    } catch (error) {
        res.status(404).json({ message: 'auth failed ' + error.message });
    }
}

module.exports = check_auth;
