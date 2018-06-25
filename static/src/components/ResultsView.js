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
export default class ResultsView extends React.Component {

    constructor(props) {
    	super(props);
	console.log("init state",this.props.location.state.response);
        this.state = this.props.location.state.response;	
	console.log("Assigned state",this.state.search_results.doc_list)
    }


    render(){
    const docs = this.state.search_results.doc_list;
    const ResultsViewThis = this;
    	return(

    		<div className="col-md-8 col-md-offset-2" style={{paddingTop: 60}}>
            {console.log(this.props, "this.props")}
		     {docs.map(function(d, idx){
			 return (<CaseCard {...ResultsViewThis.props} title={d.title} tid={d.tid} key={d.tid} 
				bench={d.bench} source={d.source} highlights={d.highlights} doc_type={d.divtype} />)
		       })}
            </div>
        );

    }
}

