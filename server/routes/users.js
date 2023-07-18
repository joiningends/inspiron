const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.delete('/:id', userController.deleteUser);
router.get('/get/count', userController.getUserCount);

module.exports = router;
