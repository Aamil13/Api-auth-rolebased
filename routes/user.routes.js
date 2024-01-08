const express = require('express')
const router = express.Router()
const upload = require('../utils/imageUploader')

const {register, login, updateDP, updateName, deleteSelf} = require('../controllers/user.ctrl')


const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', upload.single('file'), register)
router.post('/login', login)
router.post('/update/name', authMiddleware, updateName)
router.post('/update/dp', authMiddleware, upload.single('file'), updateDP)
router.delete('/delete/self', authMiddleware, deleteSelf)


module.exports = router;