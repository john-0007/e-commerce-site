const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then( prods => {
    res.render('shop/products-list', {
      prods,
      pageTitle: 'All Products',
    })
  })
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId
  Product.findById(productId).then(product => {
    res.render('shop/product-detail', {
      product,
      pageTitle: 'Product Details',
      path: '/products'
    })
  }
  )
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then( prods => {
    res.render('shop/index', {
      prods,
      pageTitle: 'Shop',
    })
  })
}

exports.getCart = (req, res, next) => {
  Cart.getCart().then( cart => {
    Product.fetchAll().then(products => {
      const cartProducts = []
      for (product of products) {
        const cartProductData = cart.products.find( prod => prod.id === product.id)
        if (cartProductData) {
          cartProducts.push({productData: product, qty: cartProductData.qty })
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        cartProducts
      })
    })
  })
}

exports.postCart = (req,res, next) => {
  const {productId} = req.body
  Product.findById(productId).then(({price}) => {
    Cart.addProduct(productId, price)
    res.redirect('/cart')
  })
}

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId).then((product) => {
    Cart.deleteProduct(productId, product.price)
  })
  res.redirect('/cart')
}

exports.getOrders = (req,res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
  })
}

exports.getCheckout = () => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
  })
}