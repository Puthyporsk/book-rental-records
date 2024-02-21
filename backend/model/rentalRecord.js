const mongoose = require("mongoose");

const rentalRecordSchema = new mongoose.Schema({
    student_name: { type: String, required: true },
    book_name: { type: String, required: true },
    rental_date: { type: Date, required: true },
    paid: { type: Boolean, requied: true },
    payment_due: { type: Number, required: true },
    comment: { type: String, required: true },
});

module.exports = mongoose.model('RentalRecord', rentalRecordSchema);
