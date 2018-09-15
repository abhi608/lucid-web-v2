import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Switch, Redirect} from 'react-router';

import * as actionCreators from '../actions/auth';
import { validateEmail } from '../utils/misc';

import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
// import Card,{CardContent, CardActions, CardHeader} from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const stylesTheme = theme => ({});

const styles = {
  card: {
    minWidth: 150,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

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
export default class CaseCard extends React.Component {

    constructor(props) {
    	super(props);
		this.state = {
			title: null,
			tid: '',
			bench: null,
			doc_type: null,
			highlights: null,
			source: null,
		};
		this.showDocument = this.showDocument.bind(this);
	}
	
	showDocument() {
		var parentThis = this;
		console.log("clicked");
		var tid = this.props.tid.toString();
		fetch("/api/fetchdoc?tid="+tid, {
			method: "GET",
		}).then((resp) => resp.json()).
		then(function(data){
			console.log("data: ", data);
			parentThis.props.router.push({
				pathname: '/doc',
				search: "?tid="+tid,
				state: {response: data}
			});
		});
	}

    render(){
	const highlights = this.props.highlights;
	const query = this.props.query;
	console.log("card",this.state)
	return (
	<div style={{paddingBottom: "1.5em"}}>
	    <Card style={styles.card}>
	        <CardContent>
  	            <Typography variant="headline" component="h2">
                    {this.props.title}
  	            </Typography>
  	            <Typography style={styles.pos} color="textSecondary">
                    {this.props.bench},{this.props.source}
  	            </Typography>
				{highlights.map(function(d, idx){
					return (<Typography variant="subheading"><div dangerouslySetInnerHTML={{__html: "..." + d + "..."}}></div>  
</Typography>)
				})}
	        </CardContent>
	        <CardActions>
  	            <Button variant="contained" size="medium" href={"/doc?tid="+this.props.tid.toString()+"&query="+this.props.query} className={stylesTheme} color="secondary">View More</Button>
	        </CardActions>
	    </Card>
	</div>
	);
     }
}



