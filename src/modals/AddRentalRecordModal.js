import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import { PropTypes } from "prop-types";

const base_url = process.env.REACT_APP_NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_BASE_URL : process.env.REACT_APP_SERVER_BASE_URL

class AddRentalRecordModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStudent: [],
            selectedItems: [],
            totalPrice: 0,
        };

        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        const { handleClose } = this.props;
        this.setState({ selectedItems: [], selectedStudent: [] });
        handleClose();
    }

    handleStudentChange(event, v) {
        const { studentList } = this.props;
        if (event) {
            let students = [];
            v.forEach((student) => {
                students.push(studentList.filter((s) => s._id === student.value)[0]);
            });
            this.setState({ selectedStudent: students });
        } else {
            this.setState({ selectedStudent: {} });
        }
    }

    handleBookChange(event, v) {
        const { bookList } = this.props;
        if (event) {
            let price = 0;
            let items = [];
            v.forEach((item) => {
                price += item.price;
                items.push(bookList.filter((book) => book._id === item.value)[0]);
            });
            this.setState({ selectedItems: items, totalPrice: price });
        } else {
            this.setState({ selectedItems: [], totalPrice: 0 });
        }
    }
    
    async editStudent(student) {
        const response = await fetch(
          `${base_url}/api/student/edit`, {
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
          `${base_url}/api/rentalRecord/create`, {
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
        const { selectedItems, selectedStudent, totalPrice } = this.state;
        const { open, studentList, bookList } = this.props;
        const studentOptions = studentList.map(item => { return { value: item._id, label: `${item.first_name} ${item.last_name}` }});
        const bookOptions = bookList.map(item => { return { value: item._id, label: item.name, price: item.price }});
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
                    for (let student of selectedStudent) {
                        const body = {
                            student: student,
                            purchased_items: selectedItems,
                            rental_date: recordJson.rental_date,
                            payment_due: totalPrice,
                            comment: recordJson.comment,
                            paid: false,
                        };
                        await this.createRentalRecord(body);
                        student.book_rental.push(selectedItems);
                        await this.editStudent(student);
                    }
                    
                    this.closeModal();
                },
                }}
            >
                <DialogTitle>Book Purchase Record</DialogTitle>
                <DialogContent>
                    <InputLabel id="student-label">Select Student(s)</InputLabel>
                    <Autocomplete
                        multiple
                        id="student"
                        fullWidth
                        onChange={(e, v) => this.handleStudentChange(e, v)}
                        options={studentOptions}
                        filterSelectedOptions
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        required
                        getOptionDisabled={() => selectedStudent.length === 1 && selectedItems.length > 1}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                            />
                        )}
                    />
                    <br />
                    <InputLabel id="book-label">Select Item(s)</InputLabel>
                    <Autocomplete
                        multiple
                        id="book"
                        fullWidth
                        onChange={(e, v) => this.handleBookChange(e, v)}
                        options={bookOptions}
                        filterSelectedOptions
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        required
                        getOptionDisabled={() => selectedStudent.length > 1 && selectedItems.length === 1}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                            />
                        )}
                    />
                    <br />
                    <label htmlFor="rental_date">Purchase Date</label>
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
                    <br />
                    <label htmlFor="payment_due">Payment Due</label>
                    <TextField
                        disabled
                        autoFocus
                        required
                        margin="dense"
                        id="payment_due"
                        name="payment_due"
                        fullWidth
                        variant="standard"
                        value={`$${totalPrice}`}
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
                <Button type="submit">Add Purchase Record</Button>
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