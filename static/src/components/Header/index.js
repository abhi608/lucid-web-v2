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
import PropTypes from 'prop-types';

import * as actionCreators from '../../actions/auth';
import SearchViewResults from '../SearchViewResults';

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
        };

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
                                <Button style={{color: "inherit", fontSize: "15px", marginTop: -10, marginRight: 180}}>Filter</Button> :
                                console.log("not /results")
                            }                           
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
