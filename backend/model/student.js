import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const studentSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, requied: false },
    book_rental: { type: [Object], required: false },
});

const Student = model('Student', studentSchema);
export default Student;
