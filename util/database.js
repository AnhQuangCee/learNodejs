const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db
const mongoConnect = (callback) => {
    MongoClient
        .connect('mongodb+srv://Spical:15069341Anhquang@@learnnodejs.uwu9r.mongodb.net/<dbname>?retryWrites=true&w=majority', { useNewUrlParser: true })
        .then(client => {
            _db = client.db('shop');
            callback(client)
        })
        .catch(err => console.log(err))
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect
exports.getDb = getDb