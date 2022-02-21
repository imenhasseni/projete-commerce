const express = require('express');
const { success, error } = require('consola');
require('dotenv').config();
const authRoute = require('./routes/authRoute');
const PORT = process.env.APP_PORT;
const DOMAIN = process.env.APP_DOMAIN;
const cors = require('cors');
const db = require('./config/database');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const categoryroute = require("./routes/categoryRoute");
const productroute = require("./routes/productRoutes");
const subCategoryroute = require("./routes/subCategoryRoutes");
const orderroute = require("./routes/orderRoute");


// Initialize the application
const app = express();

//Middlewares
app.use(cors());//securiter de la partage de ressourse
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());


//Routes

app.use('/', authRoute);
app.use('/category', categoryroute);
app.use('/product', productroute);
app.use('/subCategory', subCategoryroute);
app.use('/order', orderroute);





//start lestenting for the server on port
app.listen(PORT, async () => {
    try {
        success({
            message: `Server started on PORT ${PORT} ` + `URL : ${DOMAIN}`,
            badge: true,
        });
    } catch (err) {
        error({ message: 'error with server', badge: true });
    }
});
/*
app.listen(port,
    console.log('The server is runing ' + 'please, Open your browser at http://localhost:%s', port)
);
*/
