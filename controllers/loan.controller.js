const status = require('http-status');

let _loan;

const createLoan = (req, res) => {
    const loan = req.body;

    _loan.create(loan)
        .then((data) => {
            res.status(200);
            res.json({
                msg: "Prestamo registrado correctamente",
                data: data
            });
        })
        .catch((error) => {
            res.status(400);
            res.json({ 
                msg: "Error", 
                err: error 
            });
        })
}

const findAllLoan = (req, res) => {
    _loan.find()
        .then((data) => {
            if (data.length == 0) {
                res.status(status.NO_CONTENT);
                res.json({ msg: "No se encontraron prestamos" });
            }
            else {
                res.status(status.OK);
                res.json({ msg: "Éxito", data: data });
            }
        })
        .catch((error) => {
            res.status(status.BAD_REQUEST);
            res.json({ msg: "Error", err: error });
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
            res.json({ msg: "Éxito", data: data });
        })
        .catch((error) => {
            res.status(status.BAD_REQUEST);
            res.json({ msg: "Error", err: error });
        })
}

const updateLoan = (req, res) => {
    const { id } = req.params;
    const params = {
        _id: id
    }
    _loan.findByIdAndUpdate(params, req.body)
        .then((data) => {
            res.status(status.OK);
            res.json({ msg: "Exito", data: data });

        }).catch((error) => {
            res.status(status.NOT_FOUND);
            res.json({ msg: "Error", err: error });
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
            res.json({ msg: "Éxito", data: data });
        })
        .catch((error) => {
            res.status(status.BAD_REQUEST);
            res.json({ msg: "Error", err: error });
        })
}

module.exports = (Loan) => {
    _loan = Loan;
    return ({
        createLoan,
        findAllLoan,
        findByIdLoan,
        updateLoan,
        deleteLoan
    });
}