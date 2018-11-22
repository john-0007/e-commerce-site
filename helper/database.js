// const mysql = require('mysql2')

// const pool = mysql.createPool({
// 	host: 'localhost',
// 	user: 'root',
// 	database: 'node-complete',
// 	password: 'john54321'
// })

// module.exports = pool.promise()
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = callBack => {
	MongoClient.connect(
		'mongodb+srv://JohnJoseph:john54321@cluster0-v0bnm.mongodb.net/test?retryWrites=true'
	)
		.then(client => {
			console.log('Connected!')
			_db = client.db()
			callBack()
		})
		.catch(err => {
			console.log(err)
			throw err
		})
}

const getDb = () => {
	if (_db) {
		return _db
	}
	throw 'No Database Found'
}
module.exports = mongoConnect