const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.get('/group/:groupid', userController.getUsersByGroup);

router.post('/register', userController. registernormalUser,);
router.put('/:id', userController.updateUser);
router.post('/login', userController.loginUser);

router.post('/register/:generatedGroupId', userController.registerUser);

router.delete('/:id', userController.deleteUser);
router.get('/get/count', userController.getUserCount);
router.put('/:id/sess', userController.updateUserByTherapist);
router.put('/:id/sessionotes', userController.updateUserSessionNotes);
router.get('/:id/status', userController.updateStatusBasedOnData);
router.put('/:id/types', userController.updateUserTypes);

module.exports = router;
