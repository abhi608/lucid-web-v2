import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Switch, Redirect} from 'react-router';

import SearchBar from 'material-ui-search-bar';
import Paper from '@material-ui/core/Paper';

import * as actionCreators from '../actions/auth';
import { validateEmail } from '../utils/misc';

function mapStateToProps(state) {
    return {
        isAuthenticating: state.auth.isAuthenticating,
        statusText: state.auth.statusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}


const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};

@connect(mapStateToProps, mapDispatchToProps)
export default class SearchViewResults extends React.Component {

    constructor(props) {
    	super(props);
    	 this.state = {
             search_phrase: '',
         };
         this.changeValue = this.changeValue.bind(this);
         this.requestSearch = this.requestSearch.bind(this);
    }

    changeValue(e){
    	
    	const value = e;
    	const nextState = {};
        nextState['search_phrase'] = value;
        this.setState(nextState);
        console.log(this.state)
    }

    requestSearch(e) {
        var data = {
                  search_phrase:this.state.search_phrase,
  				};

  		var esc = encodeURIComponent;
		var query = Object.keys(data)
    				.map(k => esc(k) + '=' + esc(data[k]))
                    .join('&');
        var parentThis = this;

    	console.log(query)
        fetch("/api/search?"+query, {
              method: "GET",
            }).then((resp) => resp.json()).
            then(function(data){
                console.log("parent: ", parentThis);
                parentThis.props.router.push({
                    pathname: '/results',
                    search: "?search_phrase="+query,
                    state: {response: data}
                });
                }
            );
            
    }


    render(){
    	return(
    		<div className="col-md-6 col-md-offset-0">
                <div className="text-center">
                        <SearchBar
                            name="search_phrase"
                            value={this.state.search_phrase}
                            onChange={this.changeValue}
                            onRequestSearch={this.requestSearch}
                            style={{
                            marginLeft: 300, marginTop: -10, height: 36, maxWidth: 400
                            }}
                        />
                            
                </div>
            </div>
        );

    }
}