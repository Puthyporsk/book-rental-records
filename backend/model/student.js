const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, requied: false },
    book_rental: { type: [Object], required: false },
});

module.exports = mongoose.model('Student', studentSchema);
