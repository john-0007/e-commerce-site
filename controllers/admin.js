const Product = require('../models/product')

exports.getAddProduct =  (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    editing: false,
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title, price, description, img } = req.body
  const product = new Product({
    title, 
    price, 
    description, 
    img,
    userId: req.user
  })
  product.save()
  .then(result => {
    console.log('Product Created!')
    res.redirect('/admin/products')
  })
  .catch(err => {
    console.log(err)
  })
}

exports.getEditProduct =  (req, res, next) => {
  const editMode = req.query.edit
  const productId = req.params.productId
  if (!editMode) {
    return res.redirect('/')
  }
  Product.findById(productId)
  .then(product => {
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
  const { title, img, price, description, productId } = req.body
  Product.findById(productId)
  .then(product => {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/')
    }
    product.title = title,
    product.img = img,
    product.price = price,
    product.description = description
    return product.save()
    .then(() => {
      console.log('Product Updated!')
      res.redirect('/admin/products')
    })
  })
  .catch(err => {
    console.log(err)
  })
}

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then( products => {
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
      })
    })
}

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body
  Product.deleteOne({ _id: productId, userId: req.user._id }  )
  .then(() => {
    console.log('Product deleted')
    res.redirect('/admin/products')
  })
}