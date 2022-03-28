import React, { Component } from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiResponse: "",
            users: [],
            open: false,
            user: {
                userName: "",
                givenName: "",
                surName: "",
                DOB: ""
            },
            id: undefined
        };

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleAddUser = this.handleAddUser.bind(this);
    }

    handleClickOpen(id) {
        let user = {
            userName: "",
            givenName: "",
            surName: "",
            DOB: ""
        }
        
        if(id) {
            user = this.state.users.find((u) => u.id === id);
        }

        this.setState({ user: user });
        this.setState({ id: id });
        this.setState({ open: true });
    };

    _openDialog(id) {
        this.setState({ id: id });        
    }

    handleClose() {
        this.setState({ open: false });
    };

    handleAddUser() {
        const id = this.state.id;
        let method = 'POST';
        let url = 'http://localhost:9000/users';

        if(id) {
            method = 'PUT';
            url = 'http://localhost:9000/users/' + id;
        }
        const requestOptions = {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.user)
        };
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(userObj => {
                
                if(id) {
                    const users = [...this.state.users];
                    const updatedUserIndex = this.state.users.findIndex((u) => u.id === id);
                    users[updatedUserIndex] = userObj;
                    this.setState({ users });
                } else {
                    this.setState({ users: [...this.state.users, userObj] });
                }
                
                this.handleClose();
            });
    };

    handleDeleteUser(id) {
        fetch('http://localhost:9000/users/' + id, { method: 'DELETE' })
            .then(() => {
                this.setState({ 
                    users: this.state.users.filter(function( user ) {
                        return user.id !== id;
                    })
                });
            });
    }

    callAPI() {
        fetch("http://localhost:9000/testAPI")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    getUsers() {
        console.log("here");
        fetch("http://localhost:9000/users")
            .then(res => res.json())
            .then(res => this.setState({ users: res }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
        this.getUsers();
    }

    render() {
        const listItems = this.state.users.map((user) => {
            return <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <PersonIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={user.givenName + " " + user.surName}
                />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" onClick={() => this.handleClickOpen(user.id)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => this.handleDeleteUser(user.id)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        });

        return (
            <div className="App">

                <Grid item xs={12} md={6}>
                    <Typography variant="h6">
                        Users
                    </Typography>
                    <Button variant="outlined" onClick={() => this.handleClickOpen()}>
                        Add User
                    </Button>
                    <div>
                        <List>
                            {listItems}
                        </List>
                    </div>
                </Grid>


                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle>User</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To subscribe to this website, please enter your email address here. We
                            will send updates occasionally.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="userName"
                            label="User Name"
                            fullWidth
                            variant="standard"
                            onChange={(e) => { this.setState({ user: { ...this.state.user, userName: e.target.value, }, }); }}
                            value={this.state.user.userName}
                        />
                        <TextField
                            margin="dense"
                            id="givenName"
                            label="First Name"
                            fullWidth
                            variant="standard"
                            onChange={(e) => { this.setState({ user: { ...this.state.user, givenName: e.target.value, }, }); }}
                            value={this.state.user.givenName}
                        />
                        <TextField
                            margin="dense"
                            id="surName"
                            label="Last Name"
                            fullWidth
                            variant="standard"
                            onChange={(e) => { this.setState({ user: { ...this.state.user, surName: e.target.value, }, }); }}
                            value={this.state.user.surName}
                        />
                        <TextField
                            label="DOB"
                            type="date"
                            variant="standard"
                            fullWidth
                            onChange={(e) => { this.setState({ user: { ...this.state.user, DOB: e.target.value, }, }); }}
                            value={this.state.user.DOB}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>Cancel</Button>
                        <Button onClick={this.handleAddUser}>{(this.state.id) ? 'Update' : 'Add' }</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default App;