const express = require('express')
const { check, body } = require('express-validator/check')
const User = require('../models/user')

const router = express.Router()
 
const { getLogin, postLogin, postLogout, 
        getSingup, postSingup, getReset, 
        postReset, getNewPassword, postNewPassword } = require('../controllers/auth')

router.get('/login', getLogin)

router.post('/login',
  [
    check('email')
    .isEmail()
    .withMessage('Please enter a vaild email address')
    .normalizeEmail(),
    body(
      'password',
      'Invaild Password'
      )
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim()
  ],
 postLogin)

router.post('/logout', postLogout)

router.get('/singup', getSingup)

router.post('/singup', 
[
  check('email').isEmail()
  .withMessage('Please enter a vaild email')
  .custom((value, { req }) => {
   return User.findOne({
      email: value
    })
    .then( userDoc => {
      if (userDoc) {
       return Promise.reject('This email address already exit. Please try another one')
      }
    }) 
  })
  .normalizeEmail(),
  body(
    'password',
    'Please enter a password with only numbers and text and least 5 characters.'
    )
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  body('confirmpassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password have to match!')
      }
      return true
    })
    .trim()
],
postSingup)

router.get('/reset', getReset)

router.post('/reset', postReset)

router.get('/reset/:token', getNewPassword)

router.post('/new-password', postNewPassword)


module.exports = router