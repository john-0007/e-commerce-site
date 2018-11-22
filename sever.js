const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const roodDir = require('./helper/path')

const db = require('./helper/database')
const app = express()

app.set('view engine','ejs')

// Routes 
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

// Controllers

const get404 = require('./controllers/error')

db.execute('');

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});
app.use('/admin', adminRoutes);
app.use(shopRoutes)

app.use((req, res, next) => {
  res.status(404).render('404',{ 
    pageTitle: 'Page Not Found',
    path: '*'
  })
})

app.listen(3000,() => {
  console.log('App is running! and up')
})