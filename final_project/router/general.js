const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    // return res.status(300).json({ message: "Yet to be implemented" });
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });

    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    //   return res.status(300).json({message: "Yet to be implemented"});
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) return res.status(200).json(book);
    return res.status(404).json({ message: "Book not found" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    //   return res.status(300).json({message: "Yet to be implemented"});
    const author = req.params.author;
    const results = Object.values(books).filter(book => book.author === author);
    return res.status(200).json(results);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const title = req.params.title;
    const results = Object.values(books).filter(book => book.title === title);
    return res.status(200).json(results);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    //   return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) return res.status(200).json(book.reviews);
    return res.status(404).json({ message: "Book not found" });
});

// Get the book list available in the shop (async)
public_users.get('/async/books', async (req, res) => {
    try {
        const bookList = await new Promise((resolve) => {
            resolve(books);
        });
        res.status(200).json(bookList);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get book by ISBN (Async)
public_users.get('/async/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await new Promise((resolve) => {
            resolve(books[isbn]);
        });

        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error retrieving book" });
    }
});


// Get books by author (Async)
public_users.get('/async/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const matchingBooks = await new Promise((resolve) => {
            const results = Object.values(books).filter(book => book.author === author);
            resolve(results);
        });

        if (matchingBooks.length > 0) {
            res.status(200).json(matchingBooks);
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});


// Get books by title (Async)
public_users.get('/async/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const matchingBooks = await new Promise((resolve) => {
            const results = Object.values(books).filter(book => book.title === title);
            resolve(results);
        });

        if (matchingBooks.length > 0) {
            res.status(200).json(matchingBooks);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});


module.exports.general = public_users;
