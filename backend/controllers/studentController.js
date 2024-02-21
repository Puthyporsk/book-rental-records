import Student from "../model/student.js";

const findStudent = async (req, res, next) => {
    let students;
    try {
        students = await Student.find({});
    } catch (err) {
        console.error(err);
    }
  
    res.status(200).json({ students: students });
};

const createStudent = async (req, res, next) => {
    const { first_name, last_name, age, book_rental } = req.body;

    let existingStudent;
    try {
        existingStudent = await Student.findOne({ first_name: first_name, last_name: last_name });
    } catch (err) {
        console.error(err);
    }

    if (existingStudent) {
        console.error("A user with that email already exists, please signup with a different email");
    }

    const createdStudent = new Student({
        first_name,
        last_name,
        age,
        book_rental,
    });

    try {
        await createdStudent.save();
    } catch (err) {
        console.error(err);
    }

    res.status(201).json({ student: createdStudent.toObject({ getters: true }) });
};

const editStudent = async (req, res, next) => {
    const { _id, book_rental } = req.body;

    let existingStudent;
    try {
        existingStudent = await Student.findOneAndUpdate({
            _id: _id,
        }, {
            book_rental: book_rental,
        });
    } catch (err) {
        console.error(err);
    }

    res.status(201).json({ student: existingStudent.toObject({ getters: true }) });
};

export default { findStudent, createStudent, editStudent };