import React, { Fragment } from "react";
import {
    TextField,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import PropTypes from 'prop-types';
import moment from "moment";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DeleteIcon from '@mui/icons-material/Delete';

class RentalRecordTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            immutableRecords: [],
            records: [],
            searchWord: '',
        }

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.debounce = this.debounce.bind(this);
    }

    debounce(fn, delay = 1000) { 
        let timerId = null; 
        return (...args) => { 
            clearTimeout(timerId); 
            timerId = setTimeout(() => fn(...args), delay); 
        }; 
    }; 

    handleSearchChange(value) {
        const { immutableRecords } = this.state;
        if (value.trim() === '') {
            this.setState({ records: immutableRecords, searchWord:  value });
            return;
        }
        const { records } = this.state;
        const filteredRecords = records.filter((r) => r.student.first_name.toLowerCase().includes(value));
        this.setState({ records: filteredRecords, searchWord:  value });
    }

    componentWillReceiveProps() {
        const { rentalRecords, filterConditions } = this.props;
        console.log(rentalRecords.length, filterConditions.length);
        rentalRecords.sort((a, b) => a.student.first_name > b.student.first_name ? 1 : -1);
        this.setState({ immutableRecords: rentalRecords, records: rentalRecords });

        if (filterConditions.length !== 0) {
            filterConditions.forEach((filter) => {
                if (filter.selectedBook) {
                    this.setState({ records: rentalRecords.filter((record) => record.book._id === filter.selectedBook._id)})
                }
                if (filter.selectedStudent) {
                    this.setState({ records: rentalRecords.filter((record) => record.student._id === filter.selectedStudent._id)})
                }
                if (filter.paid === false || filter.paid) {
                    this.setState({ records: rentalRecords.filter((record) => record.paid === filter.paid)});
                }
                if (filter.rental_date) {
                    this.setState({ records: rentalRecords.filter((record) => moment(record.rental_date).format("DD/MMM/YYY") === moment(filter.rental_date).format("DD/MMM/YYY"))});
                }
            })
        }
    }

    render() {
        const { isLoaded, setOpenFilter, filterConditions } = this.props;
        const { records, searchWord } = this.state;
        return (
            <Fragment>
                <div className='search-bar'>
                    <TextField
                        id="search-field"
                        className="text"
                        variant="outlined"
                        placeholder="Search for a student..."
                        size="small"
                        value={searchWord}
                        onChange={(e) => this.debounce(this.handleSearchChange(e.target.value))}
                    />
                    <IconButton onClick={() => setOpenFilter(true)}>
                        <FilterAltIcon style={{ fill: "white" }} />
                    </IconButton>
                </div>
                <div className='records-table'>
                    <TableContainer className="table-container" component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Student's Name</TableCell>
                            <TableCell align="right">Rental Date</TableCell>
                            <TableCell align="right">Book Name</TableCell>
                            <TableCell align="right">Paid</TableCell>
                            <TableCell align="right">Payment Due</TableCell>
                            <TableCell align="right">Comment</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            { isLoaded ? (
                                records.map((record) => (
                                    <TableRow
                                        key={record._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {record.student.first_name} {record.student.last_name}
                                        </TableCell>
                                        <TableCell align="right">{moment(record.rental_date).format("DD/MMM/YY")}</TableCell>
                                        <TableCell align="right">{record.book.name}</TableCell>
                                        <TableCell align="right">{record.paid ? 'PAID' : 'UNPAID'}</TableCell>
                                        <TableCell align="right">${record.payment_due}</TableCell>
                                        <TableCell align="right">{record.comment}</TableCell>
                                        <TableCell align="right">
                                            <IconButton>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (<>Loading...</>)}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </div>
            </Fragment>
        );
    }
}

React.propTypes = {
    rentalRecords: PropTypes.array,
    isLoaded: PropTypes.bool,
    setOpenFilter: PropTypes.func,
    filterConditions: PropTypes.Object,
}

export default RentalRecordTable;