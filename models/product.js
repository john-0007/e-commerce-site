const mongodb = require('mongodb')
const { getDb } = require('../helper/database')


 module.exports = class Product {
  constructor(
    tilte, 
    price, 
    description,
    img,
    id,
    userId
    ) {
    this.title = tilte, 
    this.price = price
    this.description = description
    this.img = img
    this._id = id ? new mongodb.ObjectID(id) : null 
    this.userId = userId 
  }

  save() {
    const db = getDb()
    let dbOp
    if (this._id) {
      dbOp = db
      .collection('products')
      .updateOne({_id: this._id}, {$set: this})  
    } else {
      dbOp = db 
      .collection('products')
      .insertOne(this)
    }
    return dbOp
    .then(result => {
      console.log(result)
    })
    .catch( err => {
      console.log(err)
    })
  }

  static fetchAll() {
    const db = getDb()
    return db
    .collection('products')
    .find()
    .toArray()
    .then( products => {
      console.log(products)
      return products
    })
    .catch(err => {
      console.log(err)
    })
  }

  static findById(productId) {
    const db = getDb()
    return db
    .collection('products')
    .find({_id: new mongodb.ObjectID(productId)})
    .next()
    .then(product => {
      console.log(product)
      return product
    })
    .catch(err => {
      console.log(err)
    })
  }

  static deleteById(productId) {
    const db = getDb()
    return db
    .collection('products')
    .deleteOne({_id: new mongodb.ObjectID(productId)})
    .then(result => {
      console.log('Deleted')
    })
    .catch(err => {
      console.log(err)
    })
  }
}
