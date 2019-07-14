const router = require('express').Router();

module.exports = (wagner) => {
    const loanCtrl = wagner.invoke((Loan) => require('../controllers/loan.controller')(Loan));

    router.post('/insert/', (req, res) => loanCtrl.createLoan(req, res));
    router.get('/', (req, res) => loanCtrl.findAllLoan(req, res));
    router.get('/:id', (req, res) => loanCtrl.findByIdLoan(req, res));
    router.put('/update/:id', (req, res) => loanCtrl.updateLoan(req, res));
    router.delete('/delete/:id', (req, res) => loanCtrl.deleteLoan(req, res));
    router.get('/find/expired', (req, res) => loanCtrl.findExpiredLoans(req, res));
    return router;
}