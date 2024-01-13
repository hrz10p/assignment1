class Author {
    constructor(name, surname, birthday) {
        this.name = name;
        this.surname = surname;
        this.birthday = birthday;
    }
}

const authors = [];

function readAuthorsFromXlsx(data) {
    const validatedAuthors = data.filter(validateAuthor).map(author => new Author(author.name, author.surname, author.birthday));
    authors.push(...validatedAuthors);
}

function exportAuthorsToXlsx() {
    return authors.map(author => {
        const { name, surname, birthday } = author;
        return { name, surname, birthday };
    });
}

function updateAuthor(authorId, updatedAuthor) {
    if(!validateAuthor(updatedAuthor)) {
        throw new Error('Invalid author data');
    }
    authors[authorId] = updatedAuthor;
}

function getAuthors() {
    return authors;
}

function getAuthorById(authorId) {
    return authors[authorId];
}

function findAuthorByName(authorName) {
    return authors.find(author => author.name === authorName);
}

function addAuthor(newAuthor) {
    if(!validateAuthor(newAuthor)) {
        throw new Error('Invalid author data');
    }
    authors.push(newAuthor);
}

function deleteAuthorById(authorId) {
    authors.splice(authorId, 1);
}

function validateAuthor(author) {
    const { name, surname, birthday } = author;
    const nameRegex = /^[A-Za-z]{2,30}$/;
    const surnameRegex = /^[A-Za-z]{2,30}$/;
    
    const minDate = new Date(1800, 0, 1);
    const maxDate = new Date(2024, 11, 31);
    
    if (typeof name !== 'string' || !nameRegex.test(name)) {
        return false;
    }
    
    if (typeof surname !== 'string' || !surnameRegex.test(surname)) {
        return false;
    }
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (typeof birthday !== 'string' || !dateRegex.test(birthday)) {
        return false;
    }
    
    const [day, month, year] = birthday.split('.');
    const parsedDate = new Date(`${year}-${month}-${day}`);
    
    if (isNaN(parsedDate) || parsedDate < minDate || parsedDate > maxDate) {
        return false;
    }
    
    return true;
}

module.exports = {
    Author,
    readAuthorsFromXlsx,
    exportAuthorsToXlsx,
    updateAuthor,
    getAuthors,
    getAuthorById,
    findAuthorByName,
    addAuthor,
    deleteAuthorById,
    validateAuthor
};