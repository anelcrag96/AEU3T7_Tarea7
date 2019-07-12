//CONFIGURACION DEL EXPRESS
const bodyParse = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const wagner = require('wagner-core');
const path = require('path');

const _config = require('./_config');
const expressJWT = require('express-jwt');

let app = express();

require('./models/models')(wagner);

app.use(morgan('dev'));
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');// Dominio que tengan acceso (ej. 'http://example.com')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');// Metodos de solicitud que deseas permitir
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');// Encabecedados que permites (ej. 'X-Requested-With,content-type')
    next();
});

const urlBase = "/api/v1/";

const jwtOptions = {
    path: [/^\/api\/v1\/users\/login\/.*/,//Rutas libres, para que no pida JWT
        /^\/api\/v1\/users\//,
        /^\/api\/v1\/books\//,
        /^\/api\/v1\/loans\//]
};

app.use(expressJWT({ secret: _config.SECRETJWT }).unless(jwtOptions));//restricciones

//Controlar error por restricción
app.use(function (error, req, res, next) {
    if (error.name == "UnauthorizedError") {
        res.status(error.status).send({
            code: error.status,
            message: error.message,
            details: error.code
        });
    }//if
    else {
        next();
    }//else
});

const user = require('./routers/user.router')(wagner);//CONTROLAR RUTAS ESPECIFICAS
const book = require('./routers/book.router')(wagner);
const loan = require('./routers/loan.router')(wagner);

app.use(urlBase + 'users', user);
app.use(urlBase + 'books', book);
app.use(urlBase + 'loans', loan);

module.exports = app;