const status = require('http-status');
var moment = require('moment');

let _book;

const createBook = (req, res) => {
    const book = req.body;

    _book.create(book)
        .then((data) => {
            res.status(200);
            res.json({
                msg: "Libro registrado con éxito",
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

const findAllBook = (req, res) => {
    _book.find()
        .then((data) => {
            if (data.length == 0) {
                res.status(status.NO_CONTENT);
                res.json({ msg: "Sin libros registrados" });
            }
            else {
                res.status(status.OK);
                res.json({ 
                    msg: "Libros consultados con éxito", 
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

const findByIdBook = (req, res) => {
    const { id } = req.params;
    const params = {
        _id: id
    }
    _book.findById(params)
        .then((data) => {
            res.status(status.OK);
            res.json({ 
                msg: "Libro consultado con éxito", 
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

const updateBook = (req, res) => {
    const { id } = req.params;
    const params = {
        _id: id
    }
    _book.findByIdAndUpdate(params, req.body)
        .then((data) => {
            res.status(status.OK);
            res.json({ 
                msg: "Libro modificado con éxito",
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

const deleteBook = (req, res) => {
    const { id } = req.params;
    const params = {
        _id: id
    }
    _book.findByIdAndRemove(params)
        .then((data) => {
            res.status(status.OK);
            res.json({ 
                msg: "Libro eliminado con éxito",
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
/****************** */
const createLoan = (req, res) => {
    const {id} = req.params;
    const loanD = req.body;

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

    loanD.startDate = mm + '/' + dd + '/' + yyyy;
    loanD.expirationDate = moment(loanD.startDate, 'MM/DD/YYYY').add(5, 'day')

    _book.update({_id:id},{$push:{loan:loanD}})
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
    _book.find({available:false,quantity:false,image:false,year:false,editorial:false,edition:false,author:false})
        .then((data) => {
            if (data.length == 0) {
                res.status(status.NO_CONTENT);
                res.json({ msg: "Sin prestamos registrados" });
            }
            else {
                res.status(status.OK);
                res.json({ 
                    msg: "Prestamos consultados con éxito", 
                    data:data
                });
            }
        })
        .catch((error) => {
            res.status(status.BAD_REQUEST);
            res.json({ 
                msg: "Error al realizar la busqueda de prestamos", 
                err: error 
            });
        });
}

const findByIdLoan = (req, res) => {
   
    _book.findOne({"loan._id":req.params.idP},{available:false,edition:false,editorial:false,author:false,year:false,quantity:false})
        .populate('loan.idUser')
        .then((data) => {

            if(data.length == 0){
                res.status(status.OK);
                res.json({msg:"No existe el prestamos"});
                
            }
                        
            for(i=0;i<data.loan.length;i++)
                {
                    if(data.loan[i]._id==req.params.idP)
                    {
                        console.log(req.params.idP);
                        res.status(status.OK);
                        res.json({
                        msg: "Préstamo consultado con éxito",
                        data: data.loan[i],
                        title: data.name
                        })
                    }
                
                 }
            })
        .catch((error) => {
            res.status(status.BAD_REQUEST);
            res.json({
                msg: "Error al realizar la busqueda",
                err: error
            });
        })
}

/** */
const findExpiredLoan = async (req, res) => {
    var finalData = [];
    var fechaBusqueda = {
        loan:{expirationDate: {
            $lt: new Date()
        }}
    }

    await _book.find(fechaBusqueda)  
        .populate("loan.idUser")
        .then(async (data) => {
            var actualDate = new Date();
            for (var i = 0; i < data.length; i++) {
                var loan = data.loan[0];
                //calcular los dias de adeudo
                const diffTime = Math.abs(actualDate.getTime() - loan["expirationDate"].getTime());
                const debitDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                //actualizar los dias de adeudo en el modelo
                await updateDebitDays(loan["_id"], debitDays);
                //cuando termina de actualizar agregar los datos a un nuevo arreglo
                finalData.push({
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
    const {id} = req.params;
    const loanD = req.body;

    _book.update({_id:id},{$push:{loan:loanD}})
        .then((data) => {
            res.status(200);
            res.json({
                msg: "Prestamo actualizado con éxito",
                data: data
            });
        })
        .catch((error) => {
            res.status(400);
            res.json({
                msg: "Error al actualizar",
                err: error
            });
        })
}

const deleteLoan = (req, res) => {
      _book.update({_id:req.params.id,"$pull":{"loan._id":req.params.idP}})
        .then((data) => {

            if(data.length == 0){
                res.status(status.OK);
                res.json({msg:"No existe el prestamos"});
            }      
            for(i=0;i<data.loan.length;i++)
                {
                    if(data.loan[i]._id==req.params.idP)
                    {
                        data.loan[i]
                        res.status(status.OK);
                        res.json({
                            msg: "Préstamo eliminado con éxito",
                            data: data
                        });
                    }
                
                 }
            })
            .catch((error) => {
                res.status(status.BAD_REQUEST);
                res.json({
                    msg: "Error al realizar la eliminación",
                    err: error
                });
});
}



//actualizar los dias de retraso
const updateDebitDays = async (id, debitDays) => {
    var param = {
        "debitDays": debitDays
    };

    await _book.findByIdAndUpdate(id, param, { new: true })
}
module.exports = (Book) => {
    _book = Book;
    return ({
        createBook,
        findAllBook,
        findByIdBook,
        updateBook,
        deleteBook,
        createLoan,
        findAllLoan,
        findByIdLoan,
        findExpiredLoan,
        updateLoan,
        deleteLoan
    });
}