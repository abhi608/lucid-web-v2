import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Switch, Redirect} from 'react-router';

import SearchBar from 'material-ui-search-bar';
// import Paper from '@material-ui/core/Paper';

import * as actionCreators from '../actions/auth';
import { validateEmail } from '../utils/misc';

import SearchViewResults from './SearchViewResults';
import CaseCard from './CaseCard' 

function mapStateToProps(state) {
    return {
        isAuthenticating: state.auth.isAuthenticating,
        statusText: state.auth.statusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}


@connect(mapStateToProps, mapDispatchToProps)
export default class DocView extends React.Component {

    constructor(props) {
    	super(props);
	console.log("init state",this.props.location.state.response);
        this.state = this.props.location.state.response;
    }


    render(){
    	return(

    		<div className="col-md-8 col-md-offset-2" style={{paddingTop: 60}}> 
            </div>
        );

    }
}

