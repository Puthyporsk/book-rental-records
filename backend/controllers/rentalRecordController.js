import RentalRecord from "../model/rentalRecord.js";

const findRentalRecord = async (req, res, next) => {
    let rentalRecords;
    try {
        rentalRecords = await RentalRecord.find({});
    } catch (err) {
        console.error(err);
    }
  
    res.status(200).json({ rentalRecords: rentalRecords });
};

const createRentalRecord = async (req, res, next) => {
    const {
        student,
        book,
        rental_date,
        paid,
        payment_due,
        comment,
    } = req.body;

    const createdRecord = new RentalRecord({
        student,
        book,
        rental_date,
        paid,
        payment_due,
        comment,
    });

    try {
        await createdRecord.save();
    } catch (err) {
        console.error(err);
    }

    res.status(201).json({ rentalRecords: createdRecord.toObject({ getters: true }) });
};

export default { findRentalRecord, createRentalRecord };