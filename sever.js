const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')


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

const { get404, get500 } = require('./controllers/error')

// db.execute('');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`)
  }
})

const fileFilter = (req, file, cb) => {
  if (
    file.minetype === 'image/png' ||
    file.minetype === 'image/jpg' ||
    file.minetype === 'image/jpeg' 
    ) {
      cb(null, true)
    } else {
      cb(null, false)
    }
}

app.use(bodyParser.urlencoded({extended: false}))
app.use(multer({ storage }).single('img'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
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
    if (!user) {
      return next()
    }
		req.user = user
		next()
  })
  .catch(err => {
    next(new Error(err))
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

// app.get('/500', get500)
app.use(get404)
app.use((error, req, res, next) => {
  res.status(500).render('500',{
    pageTitle: 'Error!',
    path: '/500',
    isLoggedIn: req.session.isLoggedIn,
    csrfToken: req.csrfToken()
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