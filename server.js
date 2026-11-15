const express = require('express');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Books for bookstore API
let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        copiesAvailable: 5
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        copiesAvailable: 3
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian Fiction",
        copiesAvailable: 7
    }
    // Add more books if you'd like!
];

// GET all books
app.get('/api/books', (req, res) => {
    res.json(books);
});

// GET a specific book by ID
app.get('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
});

// POST new book
app.post('/api/books', (req, res) => {
    const { title, author, genre, copiesAvailable } = req.body;

    const newBook = {
        id: books.length + 1,
        title,
        author,
        genre,
        copiesAvailable
    };

    books.push(newBook);
    res.status(201).json(newBook);
});

// PUT update an existing book
app.put('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const { title, author, genre, copiesAvailable } = req.body;

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (genre !== undefined) book.genre = genre;
    if (copiesAvailable !== undefined) book.copiesAvailable = copiesAvailable;

    res.json(book);
});

// DELETE a book
app.delete('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const deletedBook = books.splice(bookIndex, 1)[0];
    res.json({ message: 'Book deleted successfully', book: deletedBook });
});

// Start server (only when run directly, so tests can import the app)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}/api/books`);
    });
}

module.exports = app;
