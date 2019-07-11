const router = require('express').Router();

module.exports = (wagner) => {
    const userCtrl = wagner.invoke((User) => require('../controllers/user.controller')(User));

    router.post('/insert/', (req, res) => userCtrl.createUser(req, res));
    router.get('/', (req, res) => userCtrl.findAllUser(req, res));
    router.get('/:id', (req, res) => userCtrl.findByIdUser(req, res));
    router.put('/update/:id', (req, res) => userCtrl.updateUser(req, res));
    router.delete('/delete/:id', (req, res) => userCtrl.deleteUser(req, res));
    router.get('/login/:email/:password', (req, res) => userCtrl.loginUser(req, res));
    return router;
}