const router = require('express').Router();

module.exports = (wagner) => {
    const bookCtrl = wagner.invoke((Book) => require('../controllers/book.controller')(Book));

    router.post('/insert/', (req, res) => bookCtrl.createBook(req, res));
    router.get('/', (req, res) => bookCtrl.findAllUser(req, res));
    router.get('/:id', (req, res) => bookCtrl.findByIdBook(req, res));
    router.put('/update/:id', (req, res) => bookCtrl.updateBook(req, res));
    router.delete('/delete/:id', (req, res) => bookCtrl.deleteBook(req, res));
    return router;
}