const express = require('express');
const requireRole = require('../middleware/allowrole');
const usersController = require('../controller/usersController');
const router = express.Router();
router.get('/users',usersController.userList);
router.post('/users',usersController.createUser);
router.patch('/users/:id/role', usersController.updateUserRole);
router.delete('/users/:id', usersController.deleteUser);
module.exports =router;