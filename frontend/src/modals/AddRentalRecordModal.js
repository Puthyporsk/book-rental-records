import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { PropTypes } from "prop-types";

class AddRentalRecordModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStudent: {},
            selectedBook: {},
            paid: false,
        };

        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        const { handleClose } = this.props;
        this.setState({ selectedBook: {}, selectedStudent: {}, paid: false });
        handleClose();
    }

    handleStudentChange(event) {
        const { studentList } = this.props;
        this.setState({selectedStudent: studentList.filter((student) => student._id === event.target.value)[0]});
    }

    handleBookChange(event) {
        const { bookList } = this.props;
        this.setState({selectedBook: bookList.filter((book) => book._id === event.target.value)[0]});
    }
    
    handlePaidChange(event) {
        this.setState({paid: event.target.value});
    }

    async editStudent(student) {
        const response = await fetch(
          "http://localhost:5000/api/student/edit", {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(student),
          }
        );
        const responseData = await response.json();
    
        if (!response.ok) {
          throw new Error(responseData.message);
        }
    }

    async createRentalRecord(body) {
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
    }

    render() {
        const { selectedBook, selectedStudent, paid } = this.state;
        const { open, studentList, bookList } = this.props;
        return (
            <Dialog
                open={open}
                onClose={this.closeModal}
                PaperProps={{
                component: 'form',
                onSubmit: async (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const recordJson = Object.fromEntries(formData.entries());
                    const body = {
                        student: selectedStudent,
                        book: selectedBook,
                        rental_date: recordJson.rental_date,
                        paid: paid,
                        payment_due: paid ? 0 : selectedBook.price,
                        comment: recordJson.comment,
                    };
                    await this.createRentalRecord(body);
                    selectedStudent.book_rental.push(selectedBook);
                    await this.editStudent(selectedStudent);
                    this.closeModal();
                },
                }}
            >
                <DialogTitle>Book Rental Record</DialogTitle>
                <DialogContent>
                    <InputLabel id="student-label">Select A Student</InputLabel>
                    <Select
                        labelId="student-label"
                        id="student"
                        fullWidth
                        label="Student"
                        onChange={(e) => this.handleStudentChange(e)}
                    >
                        {studentList.map((student) => {
                            return (
                                <MenuItem value={student._id}>
                                    <em>{student.first_name} {student.last_name}</em>
                                </MenuItem>
                            );
                        })}
                    </Select>
                    <br />
                    <InputLabel id="book-label">Select A Book</InputLabel>
                    <Select
                        labelId="book-label"
                        id="book"
                        fullWidth
                        label="Book"
                        onChange={(e) => this.handleBookChange(e)}
                    >
                        {bookList.map((book) => {
                            return (
                                <MenuItem value={book._id}>
                                    <em>{book.name}</em>
                                </MenuItem>
                            );
                        })}
                    </Select>
                    <br />
                    <label htmlFor="rental_date">Rental Date</label>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="rental_date"
                        name="rental_date"
                        type="date"
                        fullWidth
                        variant="standard"
                    />
                    <InputLabel id="paid-label">Paid</InputLabel>
                    <Select
                        labelId="paid-label"
                        id="paid"
                        fullWidth
                        label="Paid"
                        onChange={(e) => this.handlePaidChange(e)}
                    >
                        <MenuItem value={true}>
                            <em>Yes</em>
                        </MenuItem>
                        <MenuItem value={false}>
                            <em>No</em>
                        </MenuItem>
                    </Select>
                    <br />
                    <label htmlFor="payment_due">Payment Due</label>
                    <TextField
                        disabled={paid}
                        autoFocus
                        required
                        margin="dense"
                        id="payment_due"
                        name="payment_due"
                        fullWidth
                        variant="standard"
                        value={!paid && selectedBook.price ? `$${selectedBook.price}` : ''}
                    />
                    <label htmlFor="comment">Comment</label>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="comment"
                        name="comment"
                        label="Comment"
                        type="string"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={this.closeModal}>Cancel</Button>
                <Button type="submit">Add Rental Record</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

React.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    studentList: PropTypes.array,
    bookList: PropTypes.array,
}

export default AddRentalRecordModal;