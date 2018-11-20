const fs = require('fs')
const path = require('path')

const filePath = path.join(
  path.dirname(process.mainModule.filename), 
  'data', 
  'cart.json'
)

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(filePath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 }
      if (!err) {
        cart = JSON.parse(fileContent)
      }
      // Analyze the cart => find the existing product 
      const existingProductIndex = cart.products.findIndex(product => product.id === id)
      const existingProduct = cart.products[existingProductIndex]
      let updatedProduct
      // Add new product/ increase quatity
      if (existingProduct) {
        updatedProduct = { ...existingProduct }
        updatedProduct.qty = updatedProduct.qty +1 
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = {id, qty: 1}
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice = cart.totalPrice + +productPrice
      fs.writeFile(filePath, JSON.stringify(cart), err => {
        console.log(err)
      })
    })
  }
}