import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const bookSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, requied: true },
});

const Book = model('Book', bookSchema);
export default Book;
