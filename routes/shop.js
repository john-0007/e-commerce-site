const express = require('express')
const path = require('path')
const roodDir = require('../helper/path')

const router = express.Router()

// import controllers 
const { 
  getProducts, getProduct, getIndex, 
  getCart, postCart, getOrders, 
  postOrder, postCartDeleteProduct } = require('../controllers/shop')

router.get('/', getIndex)

router.get('/products', getProducts)

router.get('/product/:productId', getProduct)

// router.get('/cart', getCart)

// router.post('/cart', postCart)

// router.post('/cart-delete-item', postCartDeleteProduct)

// router.post('/create-order', postOrder)

// router.get('/orders', getOrders)

// router.get('/checkout', getCheckout)

module.exports = router;