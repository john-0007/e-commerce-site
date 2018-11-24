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
	throw 'No Database Found!'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb