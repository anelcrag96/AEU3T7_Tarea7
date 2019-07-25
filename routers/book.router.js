const router = require('express').Router();

module.exports = (wagner) => {
    const bookCtrl = wagner.invoke((Book) => require('../controllers/book.controller')(Book));

    router.post('/insert/', (req, res) => bookCtrl.createBook(req, res));
    router.get('/', (req, res) => bookCtrl.findAllBook(req, res));
    router.get('/:id', (req, res) => bookCtrl.findByIdBook(req, res));
    router.put('/update/:id', (req, res) => bookCtrl.updateBook(req, res));
    router.delete('/delete/:id', (req, res) => bookCtrl.deleteBook(req, res));

    /**LOANS */
    router.put('/loan/insert/', (req, res) => loanCtrl.createLoan(req, res));
    router.get('/loans', (req, res) => loanCtrl.findAllLoan(req, res));
    router.get('/loans/:id', (req, res) => loanCtrl.findByIdLoan(req, res));
    router.get('/loan/find/expired/', (req, res) => loanCtrl.findExpiredLoan(req, res));
    router.put('/loan/update/:id', (req, res) => loanCtrl.updateLoan(req, res));
    router.delete('/loand/delete/:id', (req, res) => loanCtrl.deleteLoan(req, res));
    return router;
}