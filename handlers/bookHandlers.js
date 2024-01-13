const express = require('express');
const bookHandlers = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const upload = multer({ dest: 'uploads/' });


const {
    Book,
    readBooksFromXlsx,
    exportBooksToXlsx,
    updateBook,
    getBooksFiltered,
    getBookById,
    addBook,
    deleteBookById
} = require('../domain/book');


bookHandlers.get('/' , (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const nameFilter = req.query.name || null;
    const maxPrice = parseInt(req.query.maxPrice) || 150000;
    const minPrice = parseInt(req.query.minPrice) || 0;

    const books = getBooksFiltered(page, pageSize, nameFilter, minPrice, maxPrice);

    res.json(books);
});


bookHandlers.get('/export', (req, res) => {
    const books = exportBooksToXlsx();
    const worksheet = xlsx.utils.json_to_sheet(books);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Books');
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=books.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
});

bookHandlers.post('/import', upload.single('file'), (req, res) => {
    const workbook = xlsx.readFile(req.file.path);
    const sheet_name_list = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    readBooksFromXlsx(data);

    res.send('Books imported');
});

bookHandlers.get('/:id', (req, res) => {
    const bookId = req.params.id;
    res.json(getBookById(bookId));
});

bookHandlers.post('/', (req, res) => {
    const newBook = req.body;
    addBook(newBook);
    res.send('Book added');
});

bookHandlers.put('/:id', (req, res) => {
    const bookId = req.params.id;
    const updatedBook = req.body;
    updateBook(bookId, updatedBook);
    res.send('Book updated');
});

bookHandlers.delete('/:id', (req, res) => {
    const bookId = req.params.id;
    deleteBookById(bookId);
    res.send('Book deleted');
});

module.exports = bookHandlers;


