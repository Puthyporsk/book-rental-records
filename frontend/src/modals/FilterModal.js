import React from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { PropTypes } from "prop-types";

class FilterModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStudent: {},
            selectedBook: {},
            paid: null,
            selectedDate: '',
        };

        this.closeModal = this.closeModal.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    closeModal() {
        const { handleClose } = this.props;
        this.setState({ selectedBook: {}, selectedStudent: {}, paid: null, selectedDate: '' });
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

    handleDateChange(event) {
        this.setState({ selectedDate: event.target.value });
    }

    render() {
        const { selectedBook, selectedStudent, paid, selectedDate } = this.state;
        const { open, handleClose, studentList, bookList, setFilterConditions } = this.props;
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
                    let filterArray = [];
                    if (Object.keys(selectedBook).length !== 0) {
                        filterArray.push({selectedBook: selectedBook});
                    }
                    if (Object.keys(selectedStudent).length !== 0) {
                        filterArray.push({selectedStudent: selectedStudent});
                    }
                    if (paid !== null) {
                        filterArray.push({paid: paid});
                    }
                    if (recordJson.rental_date !== '') {
                        filterArray.push({ rental_date: recordJson.rental_date});
                    }
                    await setFilterConditions(filterArray);
                    handleClose();
                },
                }}
            >
                <DialogTitle>Filter Rental Records</DialogTitle>
                <DialogContent>
                <InputLabel id="student-label">Select A Student</InputLabel>
                    <Select
                        labelId="student-label"
                        id="student"
                        fullWidth
                        label="Student"
                        onChange={(e) => this.handleStudentChange(e)}
                        value={selectedStudent._id}
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
                    <br />
                    <label htmlFor="rental_date">Rental Date</label>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="rental_date"
                        name="rental_date"
                        type="date"
                        fullWidth
                        variant="standard"
                        onChange={this.handleDateChange}
                        value={selectedDate}
                    />
                    <br />
                    <br />
                    <InputLabel id="book-label">Select A Book</InputLabel>
                    <Select
                        labelId="book-label"
                        id="book"
                        fullWidth
                        label="Book"
                        onChange={(e) => this.handleBookChange(e)}
                        value={selectedBook._id}
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
                    <br />
                    <InputLabel id="paid-label">Paid</InputLabel>
                    <Select
                        labelId="paid-label"
                        id="paid"
                        fullWidth
                        label="Paid"
                        onChange={(e) => this.handlePaidChange(e)}
                        value={paid}
                    >
                        <MenuItem value={true}>
                            <em>Yes</em>
                        </MenuItem>
                        <MenuItem value={false}>
                            <em>No</em>
                        </MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                <Button onClick={async () => {
                    await setFilterConditions([]);
                    this.closeModal();
                }}>Clear</Button>
                <Button type="submit">Set Filter</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

FilterModal.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    getAllBooks: PropTypes.func,
    studentList: PropTypes.array,
    bookList: PropTypes.array,
    setFilterConditions: PropTypes.func,
}

export default FilterModal;