import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import AddStudentModal from './student/AddStudentModal';
import AddBookModal from './student/AddBookModal';
import AddRentalRecordModal from './student/AddRentalRecordModal';

const App = () => {
  const [students, setStudent] = useState([]);
  const [books, setBook] = useState([]);
  const [rentalRecords, setRentalRecords] = useState([]);
  const [openStudent, setOpenStudent] = useState(false);
  const [openBook, setOpenBook] = useState(false);
  const [openRentalRecord, setOpenRentalRecord] = useState(false);

  useEffect(() => {
    getAllStudents();
    getAllBooks();
    getAllRentalRecord();
  }, []);
  
  const getAllStudents = async () => {
    const response = await fetch(
      "http://localhost:5000/api/student/getAll"
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }
    setStudent(responseData.students);
  };

  const getAllBooks = async () => {
    const response = await fetch(
      "http://localhost:5000/api/book/getAll"
    );
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message);
    }
    setBook(responseData.books);
  };

  const getAllRentalRecord = async () => {
    const response = await fetch(
      "http://localhost:5000/api/rentalRecord/getAll"
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }
    setRentalRecords(responseData.rentalRecords);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => setOpenStudent(true)}>Add Student</button>
        <button onClick={() => setOpenBook(true)}>Add Book</button>
        <button onClick={() => setOpenRentalRecord(true)}>Add Rental Record</button>

        <AddStudentModal
          open={openStudent}
          handleClose={() => setOpenStudent(false)}
          getAllStudents={getAllStudents}
        />
        <AddBookModal
          open={openBook}
          handleClose={() => setOpenBook(false)}
          getAllBooks={getAllBooks}
        />
        <AddRentalRecordModal
          open={openRentalRecord}
          handleClose={() => setOpenRentalRecord(false)}
          studentList={students}
          bookList={books}
        />
      </header>
    </div>
  );
};

export default App;
