const Product = require('../models/product')
const { validationResult } = require('express-validator/check')
const { deleteFile } = require('../util/file')

exports.getAddProduct =  (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    editing: false,
    isError: false,
    errorMessage: null,
    validationErrors: []
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body
  const image = req.file;
  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      errorMessage: 'Attached file is not an image',
      editing: false,
      isError: true,
      product: {
        title,
        price,
        description,
      },
      validationErrors: []
    })
  }
 
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      errorMessage: 'Please fill the input corectly!',
      editing: false,
      isError: true,
      product: {
        title,
        price,
        description,
      },
      validationErrors: errors.array()
    })
  }
  const imgPath = image.path
  const product = new Product({
    title, 
    price, 
    description, 
    img: `/${imgPath}`,
    userId: req.user
  })

  product.save()
  .then(result => {
    console.log('Product Created!')
    res.redirect('/admin/products')
  })
  .catch(err => {
    const error =  new Error(err)
    error.httpStatusCode = 500
    return next(error)
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
      isError: null,
      errorMessage: null,
      validationErrors: [],
      product
    })
  })
}

exports.postEditProduct = (req, res, next) => {
  const { title, img, price, description, productId } = req.body
  const image = req.file
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      errorMessage: 'Please fill the input corectly!',
      editing: false,
      isError: true,
      product: {
        title,
        price,
        description,
      },
      validationErrors: errors.array()
    })
  }
  Product.findById(productId)
  .then(product => {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/')
    }
    product.title = title,
    product.price = price,
    product.description = description
    if (image) {
      deleteFile(product.img)
      product.img = `/${image.path}`
    }
    return product.save()
    .then(() => {
      console.log('Product Updated!')
      res.redirect('/admin/products')
    })
  })
  .catch(err => {
    const error =  new Error(err)
    error.httpStatusCode = 500
    return next(error)
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
  Product.findById(productId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found.'))
      }
      deleteFile(`.${product.img}`)
      return  Product.deleteOne({ _id: productId, userId: req.user._id }  )
    })
    .then(() => {
      console.log('Product deleted')
      res.redirect('/admin/products')
    })
    .catch(err => {
      next(err)
    })
}