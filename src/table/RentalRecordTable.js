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
    TableFooter,
    TablePagination,
    Paper,
    Checkbox,
} from '@mui/material';
import PropTypes from 'prop-types';
import moment from "moment";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FirstPageRoundedIcon from '@mui/icons-material/FirstPageRounded';
import LastPageRoundedIcon from '@mui/icons-material/LastPageRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

const base_url = process.env.REACT_APP_NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_BASE_URL : process.env.REACT_APP_SERVER_BASE_URL

class RentalRecordTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            immutableRecords: [],
            records: [],
            searchWord: '',
            page: 0,
            rowsPerPage: 10,
        }

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handlePaidCheckboxClicked = this.handlePaidCheckboxClicked.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.debounce = this.debounce.bind(this);
    }

    handleChangePage(event, newPage) {
        this.setState({ page: newPage });
    };

    handleChangeRowsPerPage(event) {
        this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 });
      };

    debounce(fn, delay = 1000) { 
        let timerId = null; 
        return (...args) => { 
            clearTimeout(timerId); 
            timerId = setTimeout(() => fn(...args), delay); 
        }; 
    };
    
    async handlePaidCheckboxClicked(e, rec) {
        const { records } = this.state;
        try {
            const response = await fetch(
              `${base_url}/api/rentalRecord/edit`,
              {
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    _id: rec._id,
                    paid: e.target.checked,
                }),
              }
            );

            const responseData = await response.json();

            if (!response.ok) {
              throw new Error(responseData.message);
            }
            
            records[records.findIndex((r) => r._id === rec._id)].paid = responseData.rentalRecords.paid
            this.setState({ records: records });
        } catch (err) {
            console.error(err);
        }
    }

    handleSearchChange(value) {
        const { immutableRecords } = this.state;
        if (value.trim() === '') {
            this.setState({ records: immutableRecords, searchWord:  value });
            return;
        }
        const filteredRecords = immutableRecords.filter((r) => r.student.first_name.toLowerCase().includes(value));
        this.setState({ records: filteredRecords, searchWord:  value });
    }
    
    componentDidMount() {
        const { rentalRecords } = this.props;
        rentalRecords.sort((a, b) => a.student.first_name > b.student.first_name ? 1 : -1);
        this.setState({ immutableRecords: rentalRecords, records: rentalRecords });
    }

    componentWillReceiveProps(newProps) {
        const { rentalRecords, filterConditions } = newProps;
        this.setState({ immutableRecords: rentalRecords, records: rentalRecords });
        let tmpArray = [...rentalRecords];
        if (filterConditions.length !== 0) {
            filterConditions.forEach((filter) => {
                if (filter.selectedStudent) {
                    tmpArray = tmpArray.filter((record) => record.student._id === filter.selectedStudent._id)
                }
                if (filter.paid === false || filter.paid) {
                    tmpArray = tmpArray.filter((record) => record.paid === filter.paid);
                }
                if (filter.rental_date) {
                    tmpArray = tmpArray.filter((record) => moment(record.rental_date).utc().format("MMM/YYY") === moment(filter.rental_date).utc().format("MMM/YYY"));
                }
                this.setState({ records: tmpArray });
            })
        }
    }

    render() {
        const { isLoaded, setOpenFilter, filterConditions } = this.props;
        const {
            records,
            searchWord,
            rowsPerPage,
            page,
        } = this.state;
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
                    <IconButton onClick={() => {
                        setOpenFilter(true);
                        this.handleSearchChange('');
                    }}>
                        <FilterAltIcon style={{ fill: "white" }} />
                    </IconButton>
                    <IconButton style={{ color: 'white '}}>
                        {filterConditions.length !== 0  ? filterConditions.length : ''}
                    </IconButton>
                </div>
                <div className='records-table'>
                    <TableContainer className="table-container" component={Paper}>
                    <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Student's Name</TableCell>
                            <TableCell align="right">Rental Date</TableCell>
                            <TableCell align="right">Purchased Items</TableCell>
                            <TableCell align="right">Payment Due</TableCell>
                            <TableCell align="right">Comment</TableCell>
                            <TableCell align="right">Paid</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            { isLoaded ? (
                                (rowsPerPage > 0
                                    ? records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : records).map((record, index) => (
                                        <TableRow
                                            key={record._id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            style={{
                                                backgroundColor: index % 2 === 0 ? '#D3D3D3' : '#FFFAFA'
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {record.student.first_name} {record.student.last_name}
                                            </TableCell>
                                            <TableCell align="right">{moment(record.rental_date).utc().format("DD/MMM/YY")}</TableCell>
                                            <TableCell align="right">{record.purchased_items.map((item) => <p>{item.name}</p>)}</TableCell>
                                            <TableCell align="right">${record.paid ? 0 : record.payment_due}</TableCell>
                                            <TableCell align="right">{record.comment}</TableCell>
                                            <TableCell align="right">
                                                <Checkbox
                                                    onClick={(e) => this.handlePaidCheckboxClicked(e, record)}
                                                    checked={record.paid}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (<>Loading...</>)}
                        </TableBody>
                        <TableFooter>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 15, { label: 'All', value: -1 }]}
                                colSpan={6}
                                count={records.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                slotProps={{
                                    select: {
                                      'aria-label': 'rows per page',
                                      'value' : rowsPerPage,
                                    },
                                    actions: {
                                      showFirstButton: true,
                                      showLastButton: true,
                                      slots: {
                                        firstPageIcon: FirstPageRoundedIcon,
                                        lastPageIcon: LastPageRoundedIcon,
                                        nextPageIcon: ChevronRightRoundedIcon,
                                        backPageIcon: ChevronLeftRoundedIcon,
                                      },
                                    },
                                  }}
                                onPageChange={this.handleChangePage}
                                onRowsPerPageChange={this.handleChangeRowsPerPage}
                            />
                        </TableFooter>
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