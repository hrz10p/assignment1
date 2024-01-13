const express = require('express');
const bodyParser = require('body-parser');
const authorHandlers = require('./handlers/authorHandlers');
const genreHandlers =require('./handlers/genreHandlers');
const bookHandlers =require('./handlers/bookHandlers');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/authors',authorHandlers);
app.use('/genres',genreHandlers)
app.use('/books',bookHandlers)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});