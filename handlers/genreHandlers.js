const express = require('express');
const genreHandlers = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const upload = multer({ dest: 'uploads/' });

const {
    Genre, 
    readGenresFromXlsx, 
    exportGenresToXlsx, 
    updateGenre, 
    getGenres, 
    getGenreById, 
    findGenreByName, 
    addGenre, 
    deleteGenreById, 
} =  require('../domain/genre');


genreHandlers.post('/import', upload.single('file'), (req, res) => {
    const workbook = xlsx.readFile(req.file.path);
    const sheet_name_list = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    readGenresFromXlsx(data);

    res.send('Genres imported');
});

genreHandlers.get('/export', (req, res) => {
    const genres = exportGenresToXlsx();
    const worksheet = xlsx.utils.json_to_sheet(genres);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Genres');
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=genres.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
});

genreHandlers.get('/getByGenreName/:name', (req, res) => {
    const genreName = req.params.name;
    const genre = findGenreByName(genreName);
    res.json(genre);
});

genreHandlers.get('/', (req, res) => {
    const genres = getGenres();
    res.json(genres);
});

genreHandlers.get('/:id', (req, res) => {
    const genreId = req.params.id;
    res.json(getGenreById(genreId));
});

genreHandlers.post('/', (req, res) => {
    const newGenre = req.body;
    addGenre(newGenre);
    res.send('Genre added');
}); 

genreHandlers.put('/:id', (req, res) => {
    const genreId = req.params.id;
    const updatedGenre = req.body;
    updateGenre(genreId, updatedGenre);
    res.send('Genre updated');
}); 

genreHandlers.delete('/:id', (req, res) => {
    const genreId = req.params.id;
    deleteGenreById(genreId);
    res.send('Genre deleted');
}); 

module.exports = genreHandlers;