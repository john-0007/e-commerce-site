const express = require('express')
const path = require('path')
const rootDir = require('../helper/path')


const router = express.Router()
const products = []
// Controllers 
const {getAddProduct, postAddProduct, getProducts, getEditProduct} = require('../controllers/admin')

router.get('/add-product', getAddProduct)

router.get('/products', getProducts)

router.post('/add-product', postAddProduct)

router.get('/edit-product/:productId', getEditProduct)

module.exports = router;
