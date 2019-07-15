const http = require('http');
const path = require('path');
const status = require('http-status');
const jwt = require('jsonwebtoken');
const _config = require('../_config');

let _user;

const createUser = (req, res) => {
    const user = req.body;

    _user.create(user)
        .then((data) => {
            res.status(200);
            res.json({
                msg: "Usuario registrado con éxito",
                data: data
            });
        })
        .catch((error) => {
            res.status(400);
            res.json({
                msg: "Error al realizar el registro",
                err: error
            });
        })
}

const findAllUser = (req, res) => {
    _user.find()
        .then((data) => {
            if (data.length == 0) {
                res.status(status.NO_CONTENT);
                res.json({ msg: "Sin usuarios registrados" });
            }
            else {
                res.status(status.OK);
                res.json({
                    msg: "Usuarios consultados con éxito",
                    data: data
                });
            }
        })
        .catch((error) => {
            res.status(status.BAD_REQUEST);
            res.json({
                msg: "Error al realizar la busqueda",
                err: error
            });
        });
}

const findByIdUser = (req, res) => {
    const { id } = req.params; //const id=req.params.id;
    const params = {
        _id: id
    }
    _user.findById(params)
        .then((data) => {
            res.status(status.OK);
            res.json({
                msg: "Usuario consultado con éxito",
                data: data
            });
        })
        .catch((error) => {
            res.status(status.BAD_REQUEST);
            res.json({
                msg: "Error al realizar la busqueda",
                err: error
            });
        })
}

const updateUser = (req, res) => {
    const { id } = req.params;
    const params = {
        _id: id
    }
    _user.findByIdAndUpdate(params, req.body)
        .then((data) => {

            res.status(status.OK);
            res.json({
                msg: "Usuario modificado con éxito",
                data: data
            });

        }).catch((error) => {
            res.status(status.NOT_FOUND);
            res.json({
                msg: "Error al realizar la modificación",
                err: error
            });
        });
}

const deleteUser = (req, res) => {
    const { id } = req.params; //const id=req.params.id;
    const params = {
        _id: id
    }
    _user.findByIdAndRemove(params)
        .then((data) => {
            res.status(status.OK);
            res.json({
                msg: "Usuario eliminado con éxito",
                data: data
            });
        })
        .catch((error) => {
            res.status(status.BAD_REQUEST);
            res.json({
                msg: "Error al realizar la eliminación",
                err: error
            });
        })
}

const loginUser = (req, res) => {
    const { email, password } = req.params;
    let query = { email: email, password: password };
    _user.findOne(query, "-password")
        .then((user) => {
            if (user) {
                const token = jwt.sign({ email: email }, _config.SECRETJWT);
                res.status(status.OK);
                res.json({
                    msg: "Acceso exitoso",
                    data: {
                        user: user,
                        token: token
                    }
                });
            }//if
            else {
                res.status(status.NOT_FOUND);
                res.json({ msg: "Error" });
            }
        })
        .catch((error) => {
            res.status(status.NOT_FOUND);
            res.json({
                msg: "Error",
                err: error
            });
        });
};

module.exports = (User) => {
    _user = User;
    return ({
        createUser,
        findAllUser,
        findByIdUser,
        updateUser,
        deleteUser,
        loginUser
    });
}