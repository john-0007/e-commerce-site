const crypto = require('crypto')

const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator/check')

const transporter = nodemailer.createTransport(sendGridTransport({
	auth: {
		// api_user: 'John Joseph',
		api_key: 'keys'
	}
}))

exports.getLogin = (req, res, next) => {
	let errorMessage = req.flash('error')
	errorMessage.length > 0 ? errorMessage = errorMessage[0] : errorMessage = null
	res.render('auth/login', {
		pageTitle: 'Login',
		errorMessage,
		oldInput: {
			email: '',
			password: ''
		},
		validationErrors: []
	})
}

exports.postLogin = (req, res, next) => {
	const {
		email,
		password
	} = req.body
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(422).render('auth/login', {
			pageTitle: 'Login',
			errorMessage: 'Invaild email or password',
			oldInput: {
				email,
				password,
			},
			validationErrors: errors.array()
		})
	}
	User.findOne({
			email
		})
		.then(user => {
			if (!user) {
				req.flash('error', 'Invailid email or password')
				res.redirect('/login')
			}
			bcrypt.compare(password, user.password)
				.then(isMatch => {
					if (isMatch) {
						req.session.isLoggedIn = true
						req.session.user = user
						return req.session.save(err => {
							console.log(err)
							res.redirect('/')
						})
					}
					return res.status(422).render('auth/login', {
						pageTitle: 'Login',
						errorMessage: 'Invaild email or password',
						oldInput: {
							email,
							password,
						},
						validationErrors: []
					})
				})
		})
		.catch(err => {
			const error =  new Error(err)
			error.httpStatusCode = 500
			return next(error)
		})
}

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err)
		res.redirect('/')
	})
}

exports.getSingup = (req, res, next) => {
	let errorMessage = req.flash('error')
	errorMessage.length > 0 ? errorMessage = errorMessage[0] : errorMessage = null
	res.render('auth/singup', {
		pageTitle: 'singup',
		errorMessage,
		oldInput: {
			email: '',
			password: '',
			confirmpassword: ''
		},
		validationErrors: []
	})
}

exports.postSingup = (req, res, next) => {
	const {
		email,
		password,
		confirmpassword
	} = req.body
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		console.log(errors.array())
		return res.status(422).render('auth/singup', 
		{
			pageTitle: 'singup',
			errorMessage: errors.array()[0].msg,
			oldInput: {
				email,
				password,
				confirmpassword
			},
			validationErrors: errors.array()
		})
	}
	bcrypt.hash(password, 12)
		.then(hashedPassword => {
			const user = new User({
				email,
				password: hashedPassword,
				cart: {
					items: []
				}
			})
			return user.save()
		})
		.then(() => {
			res.redirect('/login')
			return transporter.sendMail({
				to: email,
				from: 'shop@j&J.com',
				subject: 'Singup succeeded!',
				html: '<h1>You sucessfully singned up!</h1>',
			})
		})
		.catch(err => {
			const error =  new Error(err)
			error.httpStatusCode = 500
			return next(error)
		})
}

exports.getReset = (req, res, next) => {
	let errorMessage = req.flash('error')
	errorMessage.length > 0 ? errorMessage = errorMessage[0] : errorMessage = null
	res.render('auth/reset', {
		pageTitle: 'Reset Password',
		errorMessage
	})
}

exports.postReset = (req, res, next) => {
	const email = req.body.email
	console.log(email)
	crypto.randomBytes(32, (err, Buffer) => {
		if (err) {
			console.log(err)
			return req.redirect('/reset')
		}
		const token = Buffer.toString('hex')
		User.findOne({
				email: email
			})
			.then(user => {
				if (!user) {
					req.flash('error', 'No account with that email found')
					return res.redirect('/reset')
				}
				user.resetToken = token
				user.resetTokenExpiration = Date.now() + 3600000
				return user.save()
			})
			.then(() => {
				res.redirect('/')
				transporter.sendMail({
					to: email,
					from: 'shop@j&J.com',
					subject: 'Reset password',
					html: `
				<p>You requested a password reset</p>
				<p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
				`
				})
			})
			.catch(err => {
				const error =  new Error(err)
				error.httpStatusCode = 500
				return next(error)
			})
	})
}

exports.getNewPassword = (req, res, next) => {
	const passwordToken = req.params.token
	User.findOne({ resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now() }})
		.then(user => {
			let errorMessage = req.flash('error')
			errorMessage.length > 0 ? errorMessage = errorMessage[0] : errorMessage = null
			res.render('auth/new-password', {
				pageTitle: 'New Password',
				errorMessage,
				userId: user._id.toString(),
				passwordToken
			})
		})
		.catch(err => {
			const error =  new Error(err)
			error.httpStatusCode = 500
			return next(error)
		})
}

exports.postNewPassword = (req, res, next) => {
	const { newPassword, userId, passwordToken } = req.body
	console.log( newPassword, userId, passwordToken)
	let resetUser
	User.findOne(
		{resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()},
		 _id: userId
	 })
	 .then(user => {
		resetUser = user
		return bcrypt.hash(newPassword, 12)
	 })
	 .then(hashedPassword => {
		resetUser.password = hashedPassword
		resetUser.resetToken = undefined
		resetUser.resetTokenExpiration = undefined
		return resetUser.save()
	 })
	 .then(() => {
		 res.redirect('/login')
	 })
	 .catch(err => {
    const error =  new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
}
