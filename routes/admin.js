const express = require('express')
const path = require('path')
const rootDir = require('../helper/path')
const isAuth = require('../middleware/is-auth')
const { body } = require('express-validator/check')


const router = express.Router()
const products = []
// Controllers 
const {
	getAddProduct, postAddProduct, getProducts, 
	getEditProduct, postEditProduct, postDeleteProduct 
} = require('../controllers/admin')

router.get('/add-product', isAuth, getAddProduct)

router.get('/products', isAuth, getProducts)

router.post('/add-product',
[
	body('title')
	.isString()
	.trim()
	.isLength({ min: 3}),
	body('img')
	.trim(),
	body('price')
	.isFloat()
	.trim(),
	body('description')
	.isLength({ min: 5, max: 400 })
	.trim()
],
isAuth, postAddProduct)

router.get('/edit-product/:productId', isAuth, getEditProduct)

router.post('/edit-product',
[
	body('title')
	.isString()
	.trim()
	.isLength({ min: 3}),
	body('img'),
	body('price')
	.isFloat()
	.trim(),
	body('description')
	.isLength({ min: 5, max: 400 })
	.trim()
],
isAuth, postEditProduct)

router.post('/delete-product', isAuth, postDeleteProduct)


module.exports = router;
