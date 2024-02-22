import React, { useState, useEffect } from 'react';
import './App.css';

import RentalRecordTable from './table/RentalRecordTable';
import AddStudentModal from './modals/AddStudentModal';
import AddBookModal from './modals/AddBookModal';
import AddRentalRecordModal from './modals/AddRentalRecordModal';

const App = () => {
  const [students, setStudent] = useState([]);
  const [books, setBook] = useState([]);
  const [rentalRecords, setRentalRecords] = useState([]);
  const [isLoaded, setisLoaded] = useState(false);
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
    setisLoaded(false);
    try {
      const response = await fetch(
        "http://localhost:5000/api/rentalRecord/getAll"
      );
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setRentalRecords(responseData.rentalRecords);
    } catch (err) {
      console.error(err);
    }
    setisLoaded(true);
  };

  return (
    <div>
      <header className="App-header">
        <div className='app-title'>
          <span>Cherrywood Learning Academy</span>
          <br />
          <span style={{ fontSize: 16 }}>Student Book Purchase Record</span>
        </div>
        <div>
          <button className='modal-button' onClick={() => setOpenStudent(true)}>Add Student</button>
          <button className='modal-button' onClick={() => setOpenBook(true)}>Add Book</button>
          <button className='modal-button' onClick={() => setOpenRentalRecord(true)}>Add Rental Record</button>
        </div>
      </header>
      <body style={{ backgroundColor: '#212529' }}>
        <RentalRecordTable
          rentalRecords={rentalRecords}
          isLoaded={isLoaded}
        />
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
          handleClose={() => {
            setOpenRentalRecord(false);
            getAllRentalRecord();
          }}
          studentList={students}
          bookList={books}
        />
      </body>
    </div>
  );
};

export default App;
