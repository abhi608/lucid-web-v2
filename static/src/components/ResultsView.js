import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Switch, Redirect} from 'react-router';
import Paper from 'material-ui/Paper';

import * as actionCreators from '../actions/auth';
import { validateEmail } from '../utils/misc';

import SearchViewResults from './SearchViewResults'

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
export class caseCard extends React.Component {

    constructor(props) {
    	super(props);
    	 this.state = {
             title: null,
             page: '',
         };
    }


    render(){
    	return(

    		<div>
                <SearchViewResults {...this.props}/>
            </div>
        );

    }
}











@connect(mapStateToProps, mapDispatchToProps)
export default class ResultsView extends React.Component {

    constructor(props) {
    	super(props);
    	 this.state = {
             search_phrase: '',
             page: '',
         };
    }


    render(){
    	return(

    		<div className>
                <SearchViewResults {...this.props}/>
            </div>
        );

    }
}