import React from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from 'react-select';
import InputLabel from '@mui/material/InputLabel';
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

        this.handleDateChange = this.handleDateChange.bind(this);
    }

    async handleStudentChange(event) {
        const { studentList, filterConditions, setFilterConditions } = this.props;
        if (event) {
            this.setState({selectedStudent: studentList.filter((student) => student._id === event.value)[0]});
        } else {
            this.setState({selectedStudent: {}});
            await setFilterConditions(filterConditions.filter(cond => !cond.selectedStudent));
        }
    }

    async handleBookChange(event) {
        const { bookList, filterConditions, setFilterConditions } = this.props;
        if (event) {
            this.setState({selectedBook: bookList.filter((book) => book._id === event.value)[0]});
        } else {
            this.setState({selectedBook: {}});
            await setFilterConditions(filterConditions.filter(cond => !cond.selectedBook));
        }
    }
    
    async handlePaidChange(event) {
        const { filterConditions, setFilterConditions } = this.props;
        if (event) {
            this.setState({paid: event.value});
        } else {
            this.setState({paid: null});
            await setFilterConditions(filterConditions.filter(cond => cond.paid === undefined));
        }
    }

    async handleDateChange(event) {
        const { filterConditions, setFilterConditions } = this.props;
        this.setState({ selectedDate: event.target.value });
        if (event.target.value === '') {
            await setFilterConditions(filterConditions.filter(cond => !cond.rental_date));
        }
    }

    render() {
        const { selectedBook, selectedStudent, paid, selectedDate } = this.state;
        const { open, handleClose, studentList, bookList, setFilterConditions } = this.props;
        const studentOptions = studentList.map(item => { return { value: item._id, label: `${item.first_name} ${item.last_name}` }});
        const bookOptions = bookList.map(item => { return { value: item._id, label: item.name }});
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                component: 'form',
                style:{width: '-webkit-fill-available'},
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
                <DialogTitle>Filter Purchase Records</DialogTitle>
                <DialogContent>
                <InputLabel id="student-label">Select A Student</InputLabel>
                    <Select
                        labelId="student-label"
                        id="student"
                        fullWidth
                        label="Student"
                        onChange={(e) => this.handleStudentChange(e)}
                        options={studentOptions}
                        isClearable
                        value={Object.keys(selectedStudent).length === 0 ? '' : { label: `${selectedStudent.first_name} ${selectedStudent.last_name}`, value: selectedStudent._id }}
                    />
                    <br />
                    <br />
                    <label htmlFor="rental_date">Purchase Date</label>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="rental_date"
                        name="rental_date"
                        type="month"
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
                        options={bookOptions}
                        isClearable
                        value={Object.keys(selectedBook).length === 0 ? '' : { label: selectedBook.name, value: selectedBook._id }}
                    />
                    <br />
                    <br />
                    <InputLabel id="paid-label">Paid</InputLabel>
                    <Select
                        labelId="paid-label"
                        id="paid"
                        fullWidth
                        label="Paid"
                        onChange={(e) => this.handlePaidChange(e)}
                        options={[
                            {
                                label: 'Yes',
                                value: true,
                            },
                            {
                                label: 'No',
                                value: false,
                            }
                        ]}
                        isClearable
                        value={paid === null ? null : {
                            label: paid ? 'Yes' : 'No',
                            value: paid
                        }}
                    />
                    <br />
                    <br />
                </DialogContent>
                <DialogActions>
                    <Button onClick={async () => {
                        await setFilterConditions([]);
                        this.setState({ selectedBook: {}, selectedStudent: {}, paid: null, selectedDate: '' });
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
    filterConditions: PropTypes.array,
}

export default FilterModal;