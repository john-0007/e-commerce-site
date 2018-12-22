const crypto = require('crypto')

const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')

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
		errorMessage
	})
}

exports.postLogin = (req, res, next) => {
	const { email, password } = req.body
	User.findOne({ email })
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
				return res.redirect('/login')
			})
  })
	.catch(err => {
		console.log(err)
	})
}

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err)
		res.redirect('/')
	})
}

exports.getSingup =  (req, res, next) => {
		let errorMessage = req.flash('error')
		errorMessage.length > 0 ? errorMessage = errorMessage[0] : errorMessage = null
		res.render('auth/singup', {
			pageTitle: 'singup',
			errorMessage
		})
}

exports.postSingup =  (req, res, next) => {
	const { email, password, confirmpasswor } = req.body
	User.findOne({email})
		.then(userDoc => {
			if (userDoc) {
				req.flash('error', 'This email address already exit. Please try another one')
				return res.redirect('/singup')
			}
			return bcrypt.hash(password, 12)
				.then(hashedPassword => {
					const user = new User({
						email,
						password: hashedPassword,
						cart: { items: [] }
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
		})
		.catch(err => {
			console.log(err)
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
		User.findOne({ email: email })
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
		.catch( err => {
			console.log(err)
		})
	})
}
