const fs = require('fs')
const path = require('path')

const filePath = path.join(
  path.dirname(process.mainModule.filename), 
  'data', 
  'products.json'
)


module.exports = class Product {
  constructor(
    tilte, 
    price, 
    description
    ) {
    this.title = tilte
    this.price = price
    this.description = description
  }

  save() {
    this.id = Math.random().toString()
    this.img = "https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png",
    fs.readFile(filePath, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }
      products.push(this)
      fs.writeFile(filePath, JSON.stringify(products), err => {
          console.log(err)
      })
    })
  }

  static fetchAll() {
    return new Promise((resolve, reject) => {
      let data = []
      fs.readFile(filePath, (err, fileContent) => {
        if (err) {
          data = []
        } else {
          data = JSON.parse(fileContent)
        }
        resolve(data)
      })
    })
  }

  static findById(id) {
    return new Promise((resolve, reject ) => {
      let product
      this.fetchAll().then((allProducts) => {
        product = allProducts.find(product => product.id === id)
      }).then(()=> {
        resolve(product)
      })
    })
  }
}