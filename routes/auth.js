const express = require('express')
const router = express.Router()
const { check, body } = require('express-validator/check')

const authController = require('../controllers/auth')
const User = require('../models/user')

router.get('/login', authController.getLogin)
router.post('/login', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email!')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (!user) {
                        return Promise.reject('Invalid email or password!')
                    } else {
                        return user
                    }
                })
                .catch(err => console.log(err))
        })
],
    authController.postLogin)

router.get('/signup', authController.getSignUp)
router.post('/signup',
    [check('email')
        .isEmail()
        .withMessage('Please enter a valid email!')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email exists already, please pick a different one.')
                    }
                })
        }),
    body('password', 'Please enter a password with only numbers and text and at least 5 character.')
        .isLength({ min: 5 })
        .isAlphanumeric(),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password have to match!')
            }
            return true
        })
    ],
    authController.postSignUp)

router.post('/logout', authController.postLogout)

router.get('/reset', authController.getReset)
router.post('/reset', authController.postReset)

router.get('/new-password/:token', authController.getNewPassword)
router.post('/new-password', authController.postNewPassword)


module.exports = router