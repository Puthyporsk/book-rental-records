import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [students, setStudent] = useState([]);
  const [books, setBook] = useState([]);
  
  const getAllStudents = async () => {
    const response = await fetch(
      "http://localhost:5000/api/student/getAll"
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }
    console.log("responseData: ", responseData);
    setStudent(responseData.students);
  };

  const createStudent = async () => {
    const body = {
      first_name: "John",
      last_name: "Doe",
      age:  5,
      book_rental: [],
    };
    const response = await fetch(
      "http://localhost:5000/api/student/create", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      }
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }
    console.log("responseData: ", responseData);
  };

  const editStudent = async () => {
    const response = await fetch(
      "http://localhost:5000/api/student/edit", {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(students[0]),
      }
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }
    console.log("responseData: ", responseData);
  };

  const getAllBooks = async () => {
    const response = await fetch(
      "http://localhost:5000/api/book/getAll"
    );
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message);
    }
    console.log("responseData: ", responseData);
    setBook(responseData.books);
  };

  const createBook = async () => {
    const body = {
      name: 'Calculus I',
      description:  'Math book about Calculus I',
      price:  50,
    };
    const response = await fetch(
      "http://localhost:5000/api/book/create", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      }
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }
    console.log("responseData: ", responseData);
  };

  const getAllRentalRecord = async () => {
    const response = await fetch(
      "http://localhost:5000/api/rentalRecord/getAll"
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }
    console.log("responseData: ", responseData);
  };

  const createRentalRecord = async () => {
    const body = {
      student: students[0],
      book: books[0],
      rental_date: Date.now(),
      paid: false,
      payment_due: 50,
      comment: 'Something',
    };
    const response = await fetch(
      "http://localhost:5000/api/rentalRecord/create", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      }
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }
    console.log("responseData: ", responseData);
    students[0].book_rental = responseData.rentalRecords.book;
    await editStudent();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={getAllStudents}>Get Student</button>
        <button onClick={createStudent}>Add Student</button>
        <button onClick={getAllBooks}>Get Book</button>
        <button onClick={createBook}>Add Book</button>
        <button onClick={getAllRentalRecord}>Get Rental Record</button>
        <button onClick={createRentalRecord}>Add Rental Record</button>
      </header>
    </div>
  );
};

export default App;
