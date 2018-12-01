const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')


const app = express()
const User = require('./models/user')

const MONGODB_URI = 'mongodb+srv://JohnJoseph:john54321@cluster0-v0bnm.mongodb.net/shop'
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})
const csrfProtection = csrf()

app.set('view engine','ejs')

// Routes 
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

// Controllers

const get404 = require('./controllers/error')

// db.execute('');

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({ 
    secret: 'my secret id', 
    resave: false, 
    saveUninitialized: false,
    store
  })
)
app.use(flash())
app.use(csrfProtection)


app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
  .then(user => {
    console.log('user',user)
		req.user = user
		next()
  })
  .catch(err => {
    console.log(err)
  })
})

app.use((req, res, next) => {
  res.locals.path = req.path;
  res.locals.isLoggedIn = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})


app.use('/admin', adminRoutes);
app.use(shopRoutes)
app.use(authRoutes)

app.use((req, res, next) => {
  res.status(404).render('404',{ 
    pageTitle: 'Page Not Found',
    path: '*'
  })
})

mongoose
.connect(MONGODB_URI)
.then(() => {
  app.listen(3000)
})
.catch(err => {
  console.log(err)
})