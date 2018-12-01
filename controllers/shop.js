const Product = require('../models/product')
const Order = require('../models/order')

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
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    const products = user.cart.items
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
    console.log('product',product)
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
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    const products = user.cart.items.map(item => {
      return {quantity: item.quantity, product: { ...item.productId._doc }}
    })
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user
      },
      products
    })
    return order.save()
  })
  .then(() => {
    return req.user.clearCart()
  })
  .then(() => {
    res.redirect('/orders')
  })
  .catch(err => {
    console.log(err)
  })
}

exports.getOrders = (req,res, next) => {
  Order.find({ 'user.userId': req.user._id })
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