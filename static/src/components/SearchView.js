import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Switch, Redirect} from 'react-router';

import SearchBar from 'material-ui-search-bar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import * as actionCreators from '../actions/auth';
import { validateEmail } from '../utils/misc';

import Image from '../../img/about-bg.jpg';
import ReactLoading from 'react-loading';

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


const styles = {
    paperContainer: {
        position: 'static',
        marginTop: -10,
        marginLeft: -115,
        marginBottom: -270,
        backgroundImage: `url(${Image})`,
        flex: 1,
        width: '120%',
        height: '85.4%',
        resizeMode: 'contain',
        opacity: 0.95,
        paddingTop: 100
    },
    searchBar: {
        margin: '0 auto',
        maxWidth: 600,
        width: 'auto',
        paddingLeft: 20
    }
};

@connect(mapStateToProps, mapDispatchToProps)
export default class SearchView extends React.Component {

    constructor(props) {
    	super(props);
    	 this.state = {
             search_phrase: '',
             loading: false,
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
        this.setState({loading: true});
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
            parentThis.props.router.push({
                pathname: '/results',
                search: "?"+query,
                state: {response: data}
            });
            }
        );
            
    }

    render(){
    	return(
    		<div> 
                    
                        <div className="text-center" style={{marginBottom: '12.5%', paddingTop: '7%'}}>

                            <Typography variant="display3" style={{color: 'darkslategray', paddingBottom: '2%'}}>
                                Search Lucid-Law
                            </Typography>

                            <SearchBar
                            	name="search_phrase"
                            	value={this.state.search_phrase}
      							onChange={this.changeValue}
      							onRequestSearch={this.requestSearch}
      							style={styles.searchBar}
    						/>
                                     
                        </div>
                        {this.state.loading ? 
                            <div style={{marginLeft: "50%"}}>
                                <ReactLoading type="spinningBubbles" color="#2f9599" height={'10%'} width={'10%'} />
                            </div> :
                            console.log("Not loading")
                        }

            </div>
        );

    }
}
