import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Switch, Redirect} from 'react-router';

import * as actionCreators from '../actions/auth';
import { validateEmail } from '../utils/misc';


import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';


const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

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
export default class IconLabelButtons extends React.Component{
    constructor(props) {
    	super(props);
	console.log("init state",this.props.location.state.response);
        this.state = this.props.location.state.response;	
	console.log("Assigned state",this.state.search_results.doc_list)
    }
  render(){
  return (
	
      <Button variant="contained" color="secondary"  className={styles.button} onClick={this.props.onClick}>
        Load More Docs 
        <AddIcon className={styles.button} />
      </Button>
      );
   }
}
