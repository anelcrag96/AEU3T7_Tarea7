const router = require('express').Router();

module.exports = (wagner) => {
    const bookCtrl = wagner.invoke((Book) => require('../controllers/book.controller')(Book));

    router.post('/insert/', (req, res) => bookCtrl.createBook(req, res));
    router.get('/', (req, res) => bookCtrl.findAllBook(req, res));
    router.get('/find/:id', (req, res) => bookCtrl.findByIdBook(req, res));
    router.put('/update/:id', (req, res) => bookCtrl.updateBook(req, res));
    router.delete('/delete/:id', (req, res) => bookCtrl.deleteBook(req, res));

    /**LOANS */
    router.put('/loan/insert/:id', (req, res) => bookCtrl.createLoan(req, res));
    router.get('/loans/', (req, res) => bookCtrl.findAllLoan(req, res));
    router.get('/loan/:idP', (req, res) => bookCtrl.findByIdLoan(req, res));
    router.get('/loan/find/expired/', (req, res) => bookCtrl.findExpiredLoan(req, res));
    router.put('/loan/update/:id', (req, res) => bookCtrl.updateLoan(req, res));
    router.delete('/loand/delete/:id', (req, res) => bookCtrl.deleteLoan(req, res));
    return router;
}