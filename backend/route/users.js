const express = require('express');
const requireRole = require('../middleware/allowrole');
const usersController = require('../controller/usersController');
const router = express.Router();
router.get('/users',usersController.userList);
router.post('/users', requireRole(['admin']),usersController.createUser);
router.patch('/users/:id/role', requireRole(['admin']), usersController.updateUserRole);
router.delete('/users/:id', requireRole(['admin']), usersController.deleteUser);
module.exports =router;