const Product = require('../models/product')
exports.getAddProduct =  (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    editing: false,
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body
  const product = new Product(title, price, description)
  product.save()
  res.redirect('/');
}

exports.getEditProduct =  (req, res, next) => {
  const editMode = req.query.edit
  const productId = req.params.productId
  if (!editMode) {
    return res.redirect('/')
  }
  Product.findById(productId).then((product) => {
    if (!product) {
      res.redirect('/')
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/edit-product',
      editing: editMode,
      product
    })
  })
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then( prods => {
    res.render('admin/products', {
      prods,
      pageTitle: 'admin products',
    })
  })
}