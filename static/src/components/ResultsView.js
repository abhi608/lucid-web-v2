import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Switch, Redirect} from 'react-router';

import AutoComplete from 'material-ui/AutoComplete';
import SearchBar from 'material-ui-search-bar';
import Paper from 'material-ui/Paper';

import * as actionCreators from '../actions/auth';
import { validateEmail } from '../utils/misc';

import SearchView from './SearchView'

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
export default class caseCard extends React.Component {

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
                <SearchView {...this.props}/>
            </div>
        );

    }
}