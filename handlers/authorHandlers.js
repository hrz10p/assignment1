const express = require('express');
const authorHandlers = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const upload = multer({ dest: 'uploads/' });

const { Author,  
    readAuthorsFromXlsx,
    exportAuthorsToXlsx,
    updateAuthor,
    getAuthors,
    getAuthorById,
    findAuthorByName,
    addAuthor,
    deleteAuthorById} = require('../domain/author');



authorHandlers.post('/import', upload.single('file'), (req, res) => {
    const workbook = xlsx.readFile(req.file.path);
    const sheet_name_list = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    readAuthorsFromXlsx(data);

    res.send('Authors imported');
});


authorHandlers.get('/export', (req, res) => {
    const authors = exportAuthorsToXlsx();
    const worksheet = xlsx.utils.json_to_sheet(authors);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Authors');
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=authors.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
});


authorHandlers.get('getByAuthorName/:name', (req, res) => {
    const authorName = req.params.name;
    const author = findAuthorByName(authorName);
    res.json(author);
});

authorHandlers.get('/', (req, res) => {
    const authors = getAuthors();
    res.json(authors);
});


authorHandlers.get('/:id', (req, res) => {
    const authorId = req.params.id;
    res.json(getAuthorById(authorId));
});

authorHandlers.post('/', (req, res) => {
    const author = new Author(req.body.name, req.body.surname, req.body.birthday);
    try {
        addAuthor(author);
        res.json(author);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

authorHandlers.put('/:id', (req, res) => {
    const authorId = req.params.id;
    const author = Author(req.body.name, req.body.surname, req.body.birthday);
    try {
        updateAuthor(authorId, author);
        res.json(author)
    } catch (error) {
        res.status(400).send(error.message);
    }
});

authorHandlers.delete('/:id', (req, res) => {
    const authorId = req.params.id;
    deleteAuthorById(authorId);
    res.send(`Delete author with ID ${authorId}`);
});

module.exports = authorHandlers;
