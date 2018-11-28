const express = require('express')
const path = require('path')
const rootDir = require('../helper/path')
const isAuth = require('../middleware/is-auth')


const router = express.Router()
const products = []
// Controllers 
const {
	getAddProduct, postAddProduct, getProducts, 
	getEditProduct, postEditProduct, postDeleteProduct 
} = require('../controllers/admin')

router.get('/add-product', isAuth, getAddProduct)

router.get('/products', isAuth, getProducts)

router.post('/add-product', isAuth, postAddProduct)

router.get('/edit-product/:productId', isAuth, getEditProduct)

router.post('/edit-product', isAuth, postEditProduct)

router.post('/delete-product', isAuth, postDeleteProduct)


module.exports = router;
