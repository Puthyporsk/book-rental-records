import mongoose from 'mongoose';
import Student from './student.js';
import Book from './book.js';
const { Schema, model } = mongoose;

const rentalRecordSchema = new Schema({
    student: { type: {Student}, required: true },
    book: { type: {Book}, required: true },
    rental_date: { type: Date, required: true },
    paid: { type: Boolean, requied: true },
    payment_due: { type: Number, required: true },
    comment: { type: String, required: false },
});

const RentalRecord = model('RentalRecord', rentalRecordSchema);
export default RentalRecord;
