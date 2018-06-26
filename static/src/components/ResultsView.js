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
import IconLabelButton from './IconLabelButton'

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
	this.loadMore = this.loadMore.bind(this);

    }

    
    loadMore(e) {
	console.log("loadingMore")
	var parentThis = this;
	fetch("/api/get_more").then(
	    (resp) => resp.json()).then(
		function(data){
		    console.log(data);
		    var newState = {}
		    newState['is_end'] = data.is_end;
		    newState['search_results'] = {}
		    newState.search_results['doc_list'] = parentThis.state.search_results.doc_list.concat(data.doc_list)
		    parentThis.setState(newState);
			});	
    } 

    render(){
        const ResultsViewThis = this;
        const docs = this.state.search_results.doc_list;
        const n_hits = this.state.search_results.n_hits;
    	return(
	<div className="col-md-8 col-md-offset-2" style={{marginTop: 60}}>
	    <p>{n_hits} results found</p>
    	    <div  id="docCardList"> 
            {console.log("Casecard: ", CaseCard)}
		     {docs.map(function(d, idx){
			 return (<CaseCard {...ResultsViewThis.props} title={d.title} tid={d.tid} key={d.tid} 
				bench={d.bench} source={d.source} highlights={d.highlights} doc_type={d.divtype} />)
		       })}
              </div>

	     {this.state.is_end ? <p>No more docs to show</p> :
	      <div  style={{alignItems:'center', display:'flex', justifyContent:'center'}}>
		      <IconLabelButton {...this.props}  id="refresh" onClick={this.loadMore}  />	
	      </div>}
	</div>
        );

    }
}

