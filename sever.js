const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const mongoose = require('mongoose')

const app = express()
const User = require('./models/user')

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

app.use((req, res, next) => {
  User.findById('5bfbd91a2fa1c40bcc78d408')
  .then(user => {
    req.user = user
    next()
  })
  .catch(err => {
    console.log(err)
  })
});

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
  User.findOne()
  .then(user => {
    if (!user) {
      const user = new User({
        name: 'John',
        email: 'john@example.com',
        cart: []
      })
      user.save()
    }
  })
  app.listen(3000)
})
.catch(err => {
  console.log(err)
})