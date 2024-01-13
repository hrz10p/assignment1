class Genre { constructor(name) { this.name = name; } }

const genres = [];

function readGenresFromXlsx(data) {
     const validatedGenres = data.filter(validateGenre).map(genre => new Genre(genre.name));
     genres.push(...validatedGenres); 
    }

function exportGenresToXlsx() { 
    return genres.map(genre => { const { name } = genre; 
    return { name }; }); 
}

function updateGenre(genreId, updatedGenre) {
     if (!validateGenre(updatedGenre)) { 
        throw new Error('Invalid genre data'); 
     } 
    genres[genreId] = updatedGenre; 
}

function getGenres() { 
    return genres; 
}

function getGenreById(genreId) { 
    return genres[genreId]; 
}

function findGenreByName(genreName) { 
    return genres.find(genre => genre.name === genreName); 
}

function addGenre(newGenre) { 
    if (!validateGenre(newGenre)) { 
        throw new Error('Invalid genre data'); 
    } 
    genres.push(newGenre); 
}

function deleteGenreById(genreId) { 
    genres.splice(genreId, 1); 
}

function validateGenre(genre) { 
    const { name } = genre; 
    const nameRegex = /^[A-Za-z\s]{2,30}$/;
    if (typeof name !== 'string' || !nameRegex.test(name)) {
        return false;
    }
    
    return true;
}

module.exports = { 
    Genre, 
    readGenresFromXlsx, 
    exportGenresToXlsx, 
    updateGenre, 
    getGenres, 
    getGenreById, 
    findGenreByName, 
    addGenre, 
    deleteGenreById, 
    validateGenre 
};