const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./db')

//init & middleware
const app = express();

app.use(express.json())

//db connection
let db

connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log("Server Listening to Port No:3000...");
        })
        db = getDb();
    }
})



//routes


app.get('/books', (req, res) => {

    //current page
    const page = req.query.p || 0
    const booksPerPage = 3

    let books = []

    db.collection('books')
        .find() //cursor with methods toArray and forEach
        .sort({ author: 1 }) //this also returns a cursor
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({ error: 'Could Not Find The Documents' })
        })


})


app.get('/books/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .findOne({ _id: new ObjectId(req.params.id) })
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch((err) => {
                res.status(500).json({ error: 'Could Not Fetch the Document' })
            })
    }
    else {
        res.status(200).json({ error: 'Not a Valid Document' })
    }

})

app.post('/books', (req, res) => {
    const book = req.body;

    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({ error: 'Could Not Create a New Document' })
        })
})

app.delete('/books/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .deleteOne({ _id: new ObjectId(req.params.id) })
            .then(result => {
                res.status(200).json(result)
            })
            .catch((err) => {
                res.status(500).json({ error: 'Could Not Delete the Document' })
            })
    }
    else {
        res.status(200).json({ error: 'Not a Valid Document' })
    }
})

app.patch('/books/:id', (req, res) => {
    const updates = req.body;

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
            .then(result => {
                res.status(200).json(result)
            })
            .catch((err) => {
                res.status(500).json({ error: 'Could Not Update the Document' })
            })
    }
    else {
        res.status(200).json({ error: 'Not a Valid Document' })
    }
})