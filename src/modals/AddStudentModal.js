import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { PropTypes } from "prop-types";

const base_url = process.env.REACT_APP_NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_BASE_URL : process.env.REACT_APP_SERVER_BASE_URL

class AddStudentModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async createStudent(body) {
        const response = await fetch(
        `${base_url}/api/student/create`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        }
        );
        const responseData = await response.json();
    
        if (!response.ok) {
            alert(responseData.message);
        }
    }
    render() {
        const { open, handleClose, getAllStudents } = this.props;
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                component: 'form',
                onSubmit: async (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const studentJson = Object.fromEntries(formData.entries());
                    const body = {
                        first_name: studentJson.first_name,
                        last_name: studentJson.last_name,
                        grade:  studentJson.grade,
                        book_rental: [],
                    };
                    await this.createStudent(body);
                    getAllStudents();
                    handleClose();
                },
                }}
            >
                <DialogTitle>Add A Student</DialogTitle>
                <DialogContent>
                    <label htmlFor="first_name">First Name</label>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="first_name"
                        name="first_name"
                        label="First Name"
                        type="string"
                        fullWidth
                        variant="standard"
                    />
                    <label htmlFor="last_name">Last Name</label>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="last_name"
                        name="last_name"
                        label="Last Name"
                        type="string"
                        fullWidth
                        variant="standard"
                    />
                    <label htmlFor="grade">Grade</label>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="grade"
                        name="grade"
                        label="Grade"
                        type="number"
                        fullWidth
                        variant="standard"
                        InputProps={{ inputProps: { min: 0 } }}
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Add Student</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

React.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    getAllStudents: PropTypes.func,
}

export default AddStudentModal;