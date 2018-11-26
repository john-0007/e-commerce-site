const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const roodDir = require('./helper/path')
const mongoose = require('mongoose')

const app = express()
// const User = require('./models/user')

app.set('view engine','ejs')

// Routes 
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

// Controllers

const get404 = require('./controllers/error')

// db.execute('');

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// app.use((req, res, next) => {
//   User.findById('5bf7ea1b1c9d4400007989dc')
//   // {username, email, cart, _id}
//   .then((user) => {
//     req.user = new User(user.name, user.email, user.cart, user._id)
//     next()
//   })
//   .catch(err => {
//     console.log(err)
//   })
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes)

app.use((req, res, next) => {
  res.status(404).render('404',{ 
    pageTitle: 'Page Not Found',
    path: '*'
  })
})

mongoose
.connect('mongodb+srv://JohnJoseph:john54321@cluster0-v0bnm.mongodb.net/shop?retryWrites=true')
.then(() => {
  app.listen(3000)
})
.catch(err => {
  console.log(err)
})