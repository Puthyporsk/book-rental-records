import Book from "../model/book.js";

const getAllBooks = async (req, res, next) => {
    let books;
    try {
        books = await Book.find({});
    } catch (err) {
        console.error(err);
    }
  
    res.status(200).json({ books: books });
};

const createBook = async (req, res, next) => {
    const { name, description, price } = req.body;

    let existingBook;
    try {
        existingBook = await Book.findOne({ name: name });
    } catch (err) {
        console.error(err);
    }

    if (existingBook) {
        console.error("Book Aleady Exists!");
    }

    const createdBook = new Book({
        name,
        description,
        price,
    });

    try {
        await createdBook.save();
    } catch (err) {
        console.error(err);
    }

    res.status(201).json({ book: createdBook.toObject({ getters: true }) });
};

export default { getAllBooks, createBook };