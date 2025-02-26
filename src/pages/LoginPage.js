import React from 'react';
import '../css/LoginPage.css';
import BookPurchaseRecordPage from './BookPurchaseRecordPage';

import {
    Button,
    TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    return (
        <div className='login-body'>
            <span className='login-title'>Login</span>
            <div className='login-modal'>
                <div>
                    <TextField
                        margin="dense"
                        label="Email"
                        type="string"
                        fullWidth
                        variant="standard"
                    />
                </div>
                <div>
                    <TextField
                        margin="dense"
                        label="Password"
                        type="string"
                        fullWidth
                        variant="standard"
                    />
                </div>
                <div className='login-button'>
                    {/* <Button id="login-btn" onClick={() => this.setState({ openHomepage: true })}>Login</Button> */}
                    <Button id="login-btn" onClick={() => navigate("homepage")}>Login</Button>
                </div>
                <div>
                    Create 
                </div>
            </div>
        </div>
    );
}

// class LoginPage extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             openHomepage: false,
//         };
//     }
//     render() {
//         const { openHomepage } = this.state;
//         const navigate = useNavigate();
//         return (
//             <>
//                 { !openHomepage ? (
//                     <div className='login-body'>
//                         <span className='login-title'>Login</span>
//                         <div className='login-modal'>
//                             <div>
//                                 <TextField
//                                     margin="dense"
//                                     label="Email"
//                                     type="string"
//                                     fullWidth
//                                     variant="standard"
//                                 />
//                             </div>
//                             <div>
//                                 <TextField
//                                     margin="dense"
//                                     label="Password"
//                                     type="string"
//                                     fullWidth
//                                     variant="standard"
//                                 />
//                             </div>
//                             <div className='login-button'>
//                                 {/* <Button id="login-btn" onClick={() => this.setState({ openHomepage: true })}>Login</Button> */}
//                                 <Button id="login-btn" onClick={navigate("homepage")}>Login</Button>
//                             </div>
//                             <div>
//                                 Create 
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <BookPurchaseRecordPage /> 
//                 )}
//             </>
//         );
//     }
// }

export default LoginPage;