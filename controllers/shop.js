const fs = require('fs')
const path = require('path')

const PDFDocument = require('pdfkit')

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

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'))
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized action'))
      }
      const invoiceName = `invoice-${orderId}.pdf`
      const invoicePath = path.join('data', 'invoices', invoiceName)
      const pdfDoc = new PDFDocument()
      res.setHeader('Content-Type', 'apllication/pdf')
      res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
      pdfDoc.pipe(fs.createWriteStream(invoicePath))
      pdfDoc.pipe(res)
      pdfDoc.fontSize(24).text('Invoice', {
        underline: true
      })
      pdfDoc.text('------------------------------------------')
      let totalPrice = 0
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price
          pdfDoc.fontSize(16).text(`${prod.product.title} - ${prod.quantity} x $${prod.product.price}`)
      });
      pdfDoc.text('--------------------------------------')
      pdfDoc.fontSize(20).text(`Total Price $${totalPrice}`)
      pdfDoc.end()
    //   fs.read(invoicePath, (err, data) => {
    //     if (err) {
    //       return next(err)
    //     }
    //     res.setHeader('Content-Type', 'apllication/pdf')
    //     res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
    //     res.send(data)
    // })
    // const file = fs.createReadStream(invoicePath)
    // file.pipe(res)
  })
  .catch(err => {
    next(err)
  })
}