import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
import LeftNav from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import PropTypes from 'prop-types';

import * as actionCreators from '../../actions/auth';
import SearchViewResults from '../SearchViewResults';
import Filter from '../FilterFinal';
import PaperSheet from '../PaperSheet'

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            isFilterOpen: false,
        };
        this.openFilter = this.openFilter.bind(this);
        this.closeFilter = this.closeFilter.bind(this);
        // this.applyFilter = this.applyFilter.bind(this);
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });

    }


    handleClickOutside() {
        this.setState({
            open: false,
        });
    }


    logout(e) {
        e.preventDefault();
        this.props.logoutAndRedirect();
        this.setState({
            open: false,
        });
    }

    openNav() {
        this.setState({
            open: true,
        });
    }

    openFilter(){
        this.setState({isFilterOpen: true});
    }

    closeFilter(){
        this.setState({isFilterOpen: false});
    }

    applyFilter = () => {
        var parentThis = this;
        this.child.applyFilter();
        this.closeFilter();
    }

    render() {
        return (
            <header>
                <div style={{flexGrow: 1}}>
                    <AppBar position="fixed" style={{ height: 45, backgroundColor: 'green' }}>
                        <Toolbar style={{ marginTop: -5, paddingRight: 0, paddingLeft: 0}}>
                            <Typography variant="title" color="inherit" style={{flex: 1, fontSize: '15px',  marginLeft: 50, marginTop: -10}}>
                                LUCID LAW
                            </Typography>
                            {this.props.location.pathname == '/results' ?
                                <SearchViewResults  {...this.props} openSearch={true}/> :
                                console.log("not /results")
                            }
                            {this.props.location.pathname == '/results' ?
                                <Button style={{color: "inherit", fontSize: "15px", marginTop: -10, marginRight: 180}} onClick={this.openFilter}>Filter</Button> :
                                console.log("not /results")
                            }
                            <div>
                            
                            {/* {this.state.isFilterOpen ?
                                <PaperSheet {...this.props}/> :
                                console.log("no filter")
                            } */}


                            <Dialog
                            fullWidth
                            open={this.state.isFilterOpen}
                            onClose={this.closeFilter}
                            aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                                <DialogContent style={{minHeight: 550}}>
                                    {/* <DialogContentText>
                                        To subscribe to this website, please enter your email address here. We will send
                                        updat   es occasionally.
                                    </DialogContentText> */}
                                    <Filter onRef={ref => (this.child = ref)} {...this.props}/>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.closeFilter} color="primary">
                                    Cancel
                                    </Button>
                                    <Button onClick={this.applyFilter} color="primary" autoFocus>
                                    Apply
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            </div>                         
                            <Button style={{color: "inherit", fontSize: "15px", marginTop: -10}}>Login</Button>
                        </Toolbar>
                    </AppBar>
                </div>
            </header>

        );
    }
}

Header.propTypes = {
    logoutAndRedirect: PropTypes.func,
    isAuthenticated: PropTypes.bool,
};
