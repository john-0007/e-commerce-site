const Product = require('../models/product')

exports.getProducts = (req, res, next) => {
  Product.find().then( products => {
    res.render('shop/products-list', {
      products,
      pageTitle: 'All Products',
    })
  })
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId
  Product.findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        pageTitle: 'Product Details',
        path: '/products'
      })
    }
  )
}

exports.getIndex = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/index', {
      pageTitle:'Shop',
      products,
    })
  })
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(products => {
    res.render('shop/cart', {
      pageTitle: 'Your Cart',
      products
    })
  })
}

exports.postCart = (req,res, next) => {
  const { productId } = req.body
  Product.findById(productId)
  .then(product => {
    return req.user.addToCart(product)
  })
  .then(result => {
    console.log('result',result)
    res.redirect('/cart')
  })
}

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user.deleteCartItem(productId)
  .then(result => {
    res.redirect('/cart')
  })
  .catch(err => {
    console.log(err)
  })
}

exports.postOrder = (req,res, next) => {
  req.user.addOrder()
  .then(() => {
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
    })
  })
  .catch(err => {
    console.log(err)
  })
}

exports.getOrders = (req,res, next) => {
  req.user.getOrder()
  .then(orders => {
    console.log('order', orders)
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      orders
    })
  })
}
exports.getCheckout = () => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
  })
}