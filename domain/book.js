class Book {
    constructor(title, author, publishYear, pageCounts, price) {
        this.title = title;
        this.author = author;
        this.publishYear = publishYear;
        this.pageCounts = pageCounts;
        this.price = price;
    }
}

const books = [];

function readBooksFromXlsx(data) {
    const validatedBooks = data.filter(validateBook).map(book => new Book(book.title, book.author, book.publishYear, book.pageCount, book.price));
    books.push(...validatedBooks);
}

function exportBooksToXlsx() {
    return books.map(book => {
        const { title, author, publishYear, pageCount, price } = book;
        return { title, author, publishYear, pageCount, price };
    });
}

function updateBook(bookId, updatedBook) {
    if(!validateBook(updatedBook)) {
        throw new Error('Invalid book data');
    }
    books[bookId] = updatedBook;
}

function getBooksFiltered(pageNumber, pageSize, bookTitle, minPrice, maxPrice) {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    let filteredBooks = books.slice(startIndex, endIndex);
    
    if (bookTitle) {
        filteredBooks = filteredBooks.filter(book => book.title === bookTitle);
    }
    
    if (minPrice && maxPrice) {
        filteredBooks = filteredBooks.filter(book => book.price >= minPrice && book.price <= maxPrice);
    }
    
    return filteredBooks;
}




function getBooks() {
    return books;
}

function getBookById(bookId) {
    return books[bookId];
}

function addBook(newBook) {
    // if(!validateBook(newBook)) {
    //     throw new Error('Invalid book data');
    // }
    books.push(newBook);
}

function deleteBookById(bookId) {
    books.splice(bookId, 1);
}

function validateBook(book) {
    return true;
    const { title, author, publishYear, pageCounts, price } = book;
    const titleRegex = /^[A-Za-z0-9\s]{2,30}$/;
    const authorRegex = /^[A-Za-z\s]{2,30}$/;
    const minPageCounts = 3;
    const maxPageCounts = 1300;
    const minDate = new Date(1800, 0, 1);
    const maxDate = new Date(2024, 11, 31);
    const minPrice = 0;
    const maxPrice = 150000;
    console.log("ASDqwe");
    if (typeof title !== 'string' || !titleRegex.test(title)) {
        return false;
    }
    
    if (typeof author !== 'string' || !authorRegex.test(author)) {
        return false;
    }
    
    if (typeof pageCounts !== 'number' || pageCounts < minPageCounts || pageCounts > maxPageCounts) {
        return false;
    }
    
    if (typeof price !== 'number' || price < minPrice || price > maxPrice) {
        return false;
    }
    console.log("ASD");
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (typeof publishYear !== 'string' || !dateRegex.test(publishYear)) {
        return false;
    }
    
    const [day, month, year] = publishYear.split('.');
    const parsedDate = new Date(`${year}-${month}-${day}`);
    
    if (isNaN(parsedDate) || parsedDate < minDate || parsedDate > maxDate) {
        return false;
    }
    
    return true;
}

module.exports =  {
    Book,
    readBooksFromXlsx,
    exportBooksToXlsx,
    updateBook,
    getBooks,
    getBookById,
    getBooksFiltered,
    addBook,
    deleteBookById,
    validateBook
};