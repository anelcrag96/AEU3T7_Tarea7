const status = require('http-status');

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
                msg: "Error al intentar registrar libro", 
                err: error 
            });
        })
}

const findAllBook = (req, res) => {
    _book.find()
        .then((data) => {
            if (data.length == 0) {
                res.status(status.NO_CONTENT);
                res.json({ msg: "No se encontraron libros" });
            }
            else {
                res.status(status.OK);
                res.json({ 
                    msg: "Éxito \nLibros disponibles", 
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
    _user.findById(params)
        .then((data) => {
            res.status(status.OK);
            res.json({ 
                msg: "Éxito \nLibro disponible", 
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

module.exports = (Book) => {
    _book = Book;
    return ({
        createBook,
        findAllBook,
        findByIdBook,
        updateBook,
        deleteBook
    });
}