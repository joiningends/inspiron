const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.get('/group/:groupid', userController.getUsersByGroup);


router.post('/register', userController. registernormalUser);
router.get('/verify/:verificationToken', userController.verify);

router.put('/:id', userController.updateUser);
router.post('/login', userController.loginUser);

router.post('/register/:generatedGroupId', userController.registerUser);

router.delete('/:id', userController.deleteUser);
router.get('/get/count', userController.getUserCount);
router.put('/:id/sess', userController.updateUserByTherapist);

router.get('/status/:appointmentId', userController.updateStatusBasedOnData);
router.get('/:id/ended/:appointmentId', userController.updateStatusBasedOnDataendthesession);
router.put('/:id/types', userController.updateUserTypes);
router.post('/forgot-password',userController.forgotPassword);

router.post('/reset-password', userController.resetPassword);
router.put('/:userId/profile', userController.updateUserProfile);
router.delete('/', userController.deleteAllTherapists);

module.exports = router;
