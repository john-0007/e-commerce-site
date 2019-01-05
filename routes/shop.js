const express = require('express')
const path = require('path')
const roodDir = require('../helper/path')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

// import controllers 
const { 
  getProducts, getProduct, getIndex, 
  getCart, postCart, getOrders, 
  postOrder, postCartDeleteProduct, getInvoice } = require('../controllers/shop')

router.get('/', getIndex)

router.get('/products', getProducts)

router.get('/product/:productId', getProduct)

router.get('/cart', isAuth, getCart)

router.post('/cart', isAuth, postCart)

router.post('/cart-delete-item', isAuth, postCartDeleteProduct)

router.post('/create-order', isAuth, postOrder)

router.get('/orders', isAuth, getOrders)

router.get('/orders/:orderId', isAuth, getInvoice)

module.exports = router;