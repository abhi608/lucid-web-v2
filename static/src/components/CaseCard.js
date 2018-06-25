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

const styles = {
  card: {
    minWidth: 275,
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
    }

    render(){
	console.log("card",this.state)
	return (
	<div style={{paddingBottom: "1.5em"}}>
	    <Card style={styles.card}>
	        <CardContent>
  	            <Typography style={styles.title} color="textSecondary">
    	              {this.props.doc_type}  
  	            </Typography>
  	            <Typography variant="headline" component="h2">
			{this.props.title}
  	            </Typography>
  	            <Typography style={styles.pos} color="textSecondary">
    	                {this.props.bench},{this.props.source}
  	            </Typography>
  	            <Typography component="p">
    	               {this.props.highlights} 
  	            </Typography>
	        </CardContent>
	        <CardActions>
  	            <Button size="small">View More</Button>
	        </CardActions>
	    </Card>
	</div>
	);
     }
}



