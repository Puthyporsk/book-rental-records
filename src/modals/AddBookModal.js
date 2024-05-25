import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { PropTypes } from "prop-types";

const base_url = process.env.REACT_APP_NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_BASE_URL : process.env.REACT_APP_SERVER_BASE_URL

class AddBookModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async createBook(body) {
          const response = await fetch(
            `${base_url}/api/book/create`, {
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
        const { open, handleClose, getAllBooks } = this.props;
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                component: 'form',
                onSubmit: async (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const bookJson = Object.fromEntries(formData.entries());
                    const body = {
                        name: bookJson.name,
                        price:  bookJson.price,
                      };
                    await this.createBook(body);
                    getAllBooks();
                    handleClose();
                },
                }}
            >
                <DialogTitle>Add A Book</DialogTitle>
                <DialogContent>
                    <label htmlFor="name">Name</label>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Name"
                        type="string"
                        fullWidth
                        variant="standard"
                    />
                    <label htmlFor="price">Price</label>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="price"
                        name="price"
                        label="Price"
                        type="number"
                        inputProps={{
                            step: 0.01,
                            min: 0.00,
                          }}
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Add Book</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

React.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    getAllBooks: PropTypes.func,
}

export default AddBookModal;