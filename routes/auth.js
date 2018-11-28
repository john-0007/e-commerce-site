const express = require('express')

const router = express.Router()
 
const { getLogin, postLogin, postLogout, getSingup, postSingup } = require('../controllers/auth')

router.get('/login', getLogin)

router.post('/login', postLogin)

router.post('/logout', postLogout)

router.get('/singup', getSingup)

router.post('/singup', postSingup)

module.exports = router