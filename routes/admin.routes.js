const express = require('express')
const router = express.Router()
const upload = require('../utils/imageUploader')

const authMiddleware = require('../middleware/authMiddleware')
const {roleMiddleware} = require('../middleware/roleMiddleware')

const { registerAdmin, getAllUsers, getSingle, deleteUser, editUser } = require('../controllers/admin.ctrl')

router.post('/register',upload.single('file'), registerAdmin);
router.get('/get/users', authMiddleware, roleMiddleware('admin'), getAllUsers);
router.get('/get/user/:id', authMiddleware, roleMiddleware('admin'), getSingle);
router.delete('/delete/user/:id', authMiddleware, roleMiddleware('admin'), deleteUser);
router.put('/update/user/:id', authMiddleware, roleMiddleware('admin'), editUser);



module.exports = router;