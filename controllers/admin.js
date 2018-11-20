const Product = require('../models/product')
exports.getAddProduct =  (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    editing: false,
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title, img, price, description } = req.body
  const product = new Product(null, title, img, price, description)
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

exports.postEditProduct = (req, res, next) => {
  const{ productId, title, img, price, description } = req.body
  console.log(productId)
  const updatedProduct = new Product(productId, title, img, price, description)
  updatedProduct.save()
  res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then( prods => {
    res.render('admin/products', {
      prods,
      pageTitle: 'admin products',
    })
  })
}

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body
  Product.deleteById(productId)
  res.redirect('/admin/products')

}