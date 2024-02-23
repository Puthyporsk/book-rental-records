import React, { useState, useEffect } from 'react';
import './App.css';

import RentalRecordTable from './table/RentalRecordTable';
import AddStudentModal from './modals/AddStudentModal';
import AddBookModal from './modals/AddBookModal';
import AddRentalRecordModal from './modals/AddRentalRecordModal';
import FilterModal from './modals/FilterModal';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      books: [],
      rentalRecords: [],
      filterConditions: [],
      isLoaded: false,
      openStudent: false,
      openBook: false,
      openRentalRecord: false,
      openFilter: false,
    };

  }

  async getAllStudents() {
    const response = await fetch(
      "http://localhost:5000/api/student/getAll"
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }
    this.setState({ students: responseData.students.sort((a, b) => a.first_name > b.first_name ? 1 : -1) });
  };

  async getAllBooks() {
    const response = await fetch(
      "http://localhost:5000/api/book/getAll"
    );
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message);
    }
    this.setState({ books: responseData.books.sort((a, b) => a.name > b.name ? 1 : -1) });
  };

  async getAllRentalRecord() {
    this.setState({ isLoaded: false });
    try {
      const response = await fetch(
        "http://localhost:5000/api/rentalRecord/getAll"
      );
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      this.setState({ rentalRecords: responseData.rentalRecords.sort((a, b) => a.student.first_name > b.student.first_name ? 1 : -1), isLoaded: true });
    } catch (err) {
      console.error(err);
    }
  };

  componentDidMount() {
    this.getAllStudents();
    this.getAllBooks();
    this.getAllRentalRecord();
  }

  render() {
    const { 
      rentalRecords,
      isLoaded,
      students,
      books,
      openRentalRecord,
      openStudent,
      openBook,
      openFilter,
      filterConditions,
    } = this.state;
    return (
      <div>
        <header className="App-header">
          <div className='app-title'>
            <span>Cherrywood Learning Academy</span>
            <br />
            <span style={{ fontSize: 16 }}>Student Book Purchase Record</span>
          </div>
          <div>
            <button className='modal-button' onClick={() => this.setState({ openStudent: true })}>Add Student</button>
            <button className='modal-button' onClick={() => this.setState({ openBook: true })}>Add Book</button>
            <button className='modal-button' onClick={() => this.setState({ openRentalRecord: true })}>Add Rental Record</button>
          </div>
        </header>
        <body style={{ backgroundColor: '#212529' }}>
          { isLoaded ? (
            <RentalRecordTable
              rentalRecords={rentalRecords}
              isLoaded={isLoaded}
              setOpenFilter={(value) => this.setState({ openFilter: value })}
              filterConditions={filterConditions}
            />
          ) : (<></>)}
          <AddStudentModal
            open={openStudent}
            handleClose={() => this.setState({ openStudent: false })}
            getAllStudents={this.getAllStudents}
          />
          <AddBookModal
            open={openBook}
            handleClose={() => this.setState({ openBook: false })}
            getAllBooks={this.getAllBooks}
          />
          <AddRentalRecordModal
            open={openRentalRecord}
            handleClose={() => {
              this.setState({ openRentalRecord: false })
              this.getAllRentalRecord();
            }}
            studentList={students}
            bookList={books}
          />
          <FilterModal
            open={openFilter}
            handleClose={() => {
              this.setState({ openFilter: false });
            }}
            studentList={students}
            bookList={books}
            setFilterConditions={(value) => this.setState({ filterConditions: value })}
          />
        </body>
      </div>
    );
  }
}

export default App;
