const status = require('http-status');
var moment = require('moment');

let _loan;

const createLoan = (req, res) => {
    const loan = req.body;

    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1; //hoy es 0!
    var yyyy = hoy.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    loan.startDate = mm + '/' + dd + '/' + yyyy;
    loan.expirationDate = moment(loan.startDate, 'MM/DD/YYYY').add(5, 'day')

    _loan.create(loan)
        .then((data) => {
            res.status(200);
            res.json({
                msg: "Prestamo registrado con éxito",
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

const findAllLoan = (req, res) => {
    _loan.find()
        .then((data) => {
            if (data.length == 0) {
                res.status(status.NO_CONTENT);
                res.json({ msg: "Sin préstamos registrados" });
            }
            else {
                res.status(status.OK);
                res.json({
                    msg: "Préstamos consultados con éxito",
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

const findByIdLoan = (req, res) => {
    const { id } = req.params;
    const params = {
        _id: id
    }
    _loan.findById(params)
        .then((data) => {
            res.status(status.OK);
            res.json({
                msg: "Préstamo consultado con éxito",
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

const findExpiredLoan = async (req, res) => {
    var finalData = [];
    var fechaBusqueda = {
        expirationDate: {
            $lt: new Date()
        }
    }

    await _loan.find(fechaBusqueda)
        .populate("idBook")    
        .populate("idUser")
        .then(async (data) => {
            var actualDate = new Date();
            for (var i = 0; i < data.length; i++) {
                var loan = data[0];
                //calcular los dias de adeudo
                const diffTime = Math.abs(actualDate.getTime() - loan["expirationDate"].getTime());
                const debitDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                //actualizar los dias de adeudo en el modelo
                await updateDebitDays(loan["_id"], debitDays);
                //cuando termina de actualizar agregar los datos a un nuevo arreglo
                finalData.push({
                    "idBook": loan["idBook"],
                    "idUser": loan["idUser"],
                    "startDate": loan["startDate"],
                    "expirationDate": loan["expirationDate"],
                    "debitDays": loan["debitDays"],
                    "amount": "$" + (debitDays * 10)
                })
            }
            res.status(200);
            res.json({
                msg: "Préstamo consultado con éxito",
                data: finalData
            })
        })
        .catch((error) => {
            res.status(status.BAD_REQUEST);
            res.json({
                msg: "Error al realizar la busqueda",
                err: error
            });
        });
}

const updateLoan = (req, res) => {
    const { id } = req.params;
    const params = {
        _id: id
    }
    _loan.findByIdAndUpdate(params, req.body)
        .then((data) => {
            res.status(status.OK);
            res.json({
                msg: "Préstamo modificado con éxito",
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

const deleteLoan = (req, res) => {
    const { id } = req.params;
    const params = {
        _id: id
    }
    _loan.findByIdAndRemove(params)
        .then((data) => {
            res.status(status.OK);
            res.json({
                msg: "Préstamo eliminado con éxito",
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

//actualizar los dias de retraso
const updateDebitDays = async (id, debitDays) => {
    var param = {
        "debitDays": debitDays
    };

    await _loan.findByIdAndUpdate(id, param, { new: true })
}

module.exports = (Loan) => {
    _loan = Loan;
    return ({
        createLoan,
        findAllLoan,
        findByIdLoan,
        findExpiredLoan,
        updateLoan,
        deleteLoan
    });
}