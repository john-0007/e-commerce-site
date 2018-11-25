const mongodb = require('mongodb')
const { getDb } = require('../helper/database')

const { ObjectId } = mongodb

class User {
	constructor(username, email, cart, id) {
		this.name = username
		this.email = email
		this.cart = cart // {items:[]}
		this._id = id
	}

	save() {
		const db = getDb()  
		return db
		.collection('users')
		.insertOne(this)
		.then(user => {
			console.log(user)
			return user
		})
		.catch(err => {
			console.log(err)
		})
	}

	addToCart(product) {
		const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString())
		let newQuantity = 1 
		const updatedCartItems = [...this.cart.items]

		if (cartProductIndex >= 0) {
			newQuantity = this.cart.items[cartProductIndex].quantity + 1
			updatedCartItems[cartProductIndex].quantity = newQuantity
		} else {
			updatedCartItems.push({
				productId: new ObjectId(product._id),
				quantity: newQuantity
			})
		}

		const updatedCart = {items: updatedCartItems }
		const db = getDb()
		return db.collection('users')
		.updateOne(
			{ _id: new ObjectId(this._id) },
			{ $set: {cart: updatedCart} }
		)
	}

	getCart() {
		const db = getDb()
		const productIds = this.cart.items.map(item => item.productId)
		return db.collection('products')
		.find({_id: {$in: productIds}})
		.toArray()
		.then(products => {
			return products.map(product => {
				return {
					...product,
					quantity: this.cart.items.find(item => {
						return item.productId.toString() === product._id.toString()
					}).quantity
				}
			})
		})
	}

	deleteCartItem(productId) {
		const db = getDb()
		const updatedCart = this.cart.items.filter(item => item.productId.toString() !== productId.toString())
		return db.collection('users')
		.updateOne(
			{ _id: new ObjectId(this._id) },
			{ $set: { cart: { items: updatedCart }} }
		)
	}

	addOrder() {
		const db = getDb()
		return this.getCart()
		.then(products => {
			const order = {
				items: products,
				user: {
					_id: new ObjectId(this._id),
					name: this.name
				}
			}
			return db.collection('orders')
			.insertOne(order)
		})
		.then(() => {
			this.cart = {items: []}
			return db.collection('users')
			.updateOne({
				 _id: new ObjectId(this._id) },
				{ $set: { cart: { items: [] }} 
			})
		})
	}

	getOrder() {
		const db = getDb()
		console.log('iddd',this._id)
		return db.collection('orders')
		.find({'user._id': new ObjectId(this._id)})
		.toArray()
	}

	static findById(userId) {
		const db = getDb()
		return db 
		.collection('users')
		.findOne({_id: new ObjectId(userId)})
		.then(user => {
			console.log(user)
			return user
		})
		.catch(err => {
			console.log(err)
		})
	}
}

module.exports = User