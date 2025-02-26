import React from 'react';
import '../css/BookPurchaseRecordPage.css';

import RentalRecordTable from '../table/RentalRecordTable';
import AddStudentModal from '../modals/AddStudentModal';
import AddBookModal from '../modals/AddBookModal';
import AddRentalRecordModal from '../modals/AddRentalRecordModal';
import FilterModal from '../modals/FilterModal';

const base_url = process.env.REACT_APP_NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_BASE_URL : process.env.REACT_APP_SERVER_BASE_URL

class BookPurchaseRecordPage extends React.Component {
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

    this.getAllStudents = this.getAllStudents.bind(this);
    this.getAllBooks = this.getAllBooks.bind(this);

  }

  async getAllStudents() {
    try {
      const response = await fetch(
        `${base_url}/api/student/getAll`
      );
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      this.setState({ students: responseData.students.sort((a, b) => a.first_name > b.first_name ? 1 : -1) });
    } catch (err) {
      console.error(err);
    }
  };

  async getAllBooks() {
    try {
      const response = await fetch(
        `${base_url}/api/book/getAll`
      );
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      this.setState({ books: responseData.books.sort((a, b) => a.name > b.name ? 1 : -1) });
    } catch (err) {
      console.error(err);
    }
  };

  async getAllRentalRecord() {
    try {
      const response = await fetch(
        `${base_url}/api/rentalRecord/getAll`
      );
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      this.setState({ rentalRecords: responseData.rentalRecords.sort((a, b) => a.student.first_name > b.student.first_name ? 1 : -1) });
    } catch (err) {
      console.error(err);
    }
  };

  async componentDidMount() {
    this.setState({ isLoaded: false });
    await this.getAllStudents();
    await this.getAllBooks();
    await this.getAllRentalRecord();
    this.setState({ isLoaded: true });
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
        <header className="BookPurchaseRecordPage-header">
          <span className="Title">Student Book Purchase Record</span>
        </header>
        <body style={{ minHeight: '90vh', overflow: 'auto', backgroundColor: '#212529' }}>
          { isLoaded ? (
            <RentalRecordTable
              rentalRecords={rentalRecords}
              isLoaded={isLoaded}
              setOpenFilter={(value) => this.setState({ openFilter: value })}
              filterConditions={filterConditions}
              handleOpenStudent={() => this.setState({ openStudent: true })}
              handleOpenBook={() => this.setState({ openBook: true })}
              handleOpenRentalRecord={() => this.setState({ openRentalRecord: true })}
            />
          ) : (<>Loading...</>)}
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
            filterConditions={filterConditions}
            setFilterConditions={(value) => this.setState({ filterConditions: value })}
          />
        </body>
      </div>
    );
  }
}

export default BookPurchaseRecordPage;
