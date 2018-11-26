const express = require('express')
const path = require('path')
const rootDir = require('../helper/path')


const router = express.Router()
const products = []
// Controllers 
const {
	getAddProduct, postAddProduct, getProducts, 
	getEditProduct, postEditProduct, postDeleteProduct 
} = require('../controllers/admin')

router.get('/add-product', getAddProduct)

router.get('/products', getProducts)

router.post('/add-product', postAddProduct)

router.get('/edit-product/:productId', getEditProduct)

router.post('/edit-product', postEditProduct)

router.post('/delete-product', postDeleteProduct)


module.exports = router;
