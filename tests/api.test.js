const request = require('supertest');
const app = require('../server');

describe('Books API', () => {
    // GET endpoints
    describe('GET /api/books', () => {
        // Test that all books are returned
        test('returns all books', async () => {
            const response = await request(app).get('/api/books');

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(3);
            expect(response.body[0]).toHaveProperty('title', 'The Great Gatsby');
        });
    });

    describe('GET /api/books/:id', () => {
        // Test that a single book is returned by its ID
        test('returns a book by ID', async () => {
            const response = await request(app).get('/api/books/2');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id', 2);
            expect(response.body).toHaveProperty('title', 'To Kill a Mockingbird');
            expect(response.body).toHaveProperty('author', 'Harper Lee');
        });

        // Test that a missing book returns a 404
        test('returns 404 for a book that does not exist', async () => {
            const response = await request(app).get('/api/books/999');

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('error', 'Book not found');
        });
    });

    // POST endpoint
    describe('POST /api/books', () => {
        // Test that a new book is created and added
        test('creates a new book', async () => {
            const newBook = {
                title: 'The Hobbit',
                author: 'J.R.R. Tolkien',
                genre: 'Fantasy',
                copiesAvailable: 4
            };

            const response = await request(app).post('/api/books').send(newBook);

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('id', 4);
            expect(response.body).toMatchObject(newBook);

            // Confirm it was actually added
            const getResponse = await request(app).get('/api/books/4');
            expect(getResponse.statusCode).toBe(200);
            expect(getResponse.body.title).toBe('The Hobbit');
        });
    });

    // PUT endpoint
    describe('PUT /api/books/:id', () => {
        // Test that an existing book is updated
        test('updates an existing book', async () => {
            const updates = { copiesAvailable: 10, genre: 'Classic Fiction' };

            const response = await request(app).put('/api/books/1').send(updates);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id', 1);
            expect(response.body).toHaveProperty('title', 'The Great Gatsby');
            expect(response.body).toHaveProperty('copiesAvailable', 10);
            expect(response.body).toHaveProperty('genre', 'Classic Fiction');
        });

        // Test that updating a missing book returns a 404
        test('returns 404 when updating a book that does not exist', async () => {
            const response = await request(app).put('/api/books/999').send({ title: 'Nope' });

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('error', 'Book not found');
        });
    });

    // DELETE endpoint
    describe('DELETE /api/books/:id', () => {
        // Test that an existing book is deleted
        test('deletes an existing book', async () => {
            const response = await request(app).delete('/api/books/3');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Book deleted successfully');
            expect(response.body.book).toHaveProperty('id', 3);

            // Confirm it is gone
            const getResponse = await request(app).get('/api/books/3');
            expect(getResponse.statusCode).toBe(404);
        });

        // Test that deleting a missing book returns a 404
        test('returns 404 when deleting a book that does not exist', async () => {
            const response = await request(app).delete('/api/books/999');

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('error', 'Book not found');
        });
    });
});
