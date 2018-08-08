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

function sanitize(str){
    var re = new RegExp('/', 'g');
    var htmlString = str.replace(re, '')
    re = new RegExp('\\\\', 'g');
    htmlString = htmlString.replace(re, '')
    return htmlString;
}


const style = {
    marginTop: '-1.25%',
    height: 'auto',
    maxHeight: 36,
    maxWidth: '90%',
    width: 'auto'
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
                  search_phrase:sanitize(this.state.search_phrase),
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
                data['load_more'] = false;
                console.log("parent: ", parentThis);
                parentThis.props.router.push({
                    pathname: '/results',
                    search: "?  "+query,
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
                            style={style}
                        />
                            
                </div>
            </div>
        );

    }
}