const { MongoClient } = require('mongodb')

let dbConnection
let uri = 'mongodb+srv://nikku:Nikku1234@cluster0.5e03et9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'


const connectToDb = (cb) => {
    MongoClient.connect(uri)
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch(err => {
            console.log(err);
            return cb(err)
        })
}

const getDb = () => dbConnection


module.exports = {
    connectToDb,
    getDb
}

//this is the basic/native mongoDB connection
//we can use mongoose for simpler connectivity