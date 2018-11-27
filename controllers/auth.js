const User = require('../models/user')
exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		pageTitle: 'Login'
	})
}

exports.postLogin = (req, res, next) => {
	User.findById('5bfd630fd8a502080b987088')
  .then(user => {
		req.session.isLoggedIn = true
		req.session.user = user
		req.session.save(err => {
			console.log(err)
			res.redirect('/')
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