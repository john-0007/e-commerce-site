const User = require('../models/user')
const bcrypt = require('bcryptjs')
exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		pageTitle: 'Login'
	})
}

exports.postLogin = (req, res, next) => {
	const { email, password } = req.body
	User.findOne({ email })
  .then(user => {
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
		res.render('auth/singup', {
			pageTitle: 'singup'
		})
}

exports.postSingup =  (req, res, next) => {
	const { email, password, confirmpasswor } = req.body
	User.findOne({email})
		.then(userDoc => {
			if (userDoc) {
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
				})
		})
		.catch(err => {
			console.log(err)
		})
}