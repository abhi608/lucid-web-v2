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

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';



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
export default class DocView extends React.Component {

    constructor(props) {
    	super(props);
	    console.log("init state",this.props.location.state.response);
        this.state = this.props.location.state.response;
	this.state['open'] = false;
	this.state['cite_available'] = false;
	this.state['doc_list'] = [];
	this.showCites = this.showCites.bind(this);
    }

  handleClose = () => {
    this.setState({ open: false });
  };


   showCites(e){
	console.log("cites clicked");
	var tid = this.state.response_doc.tid;
	var parentThis = this;
	var data = {tid: tid};
	var esc = encodeURIComponent;
	var query = Object.keys(data)
			.map(k => esc(k) + '=' + esc(data[k]))
                        .join('&');

	fetch("/api/get_cites?"+query).then(
	    (resp) => resp.json()).then(
		function(data){
		    console.log(data);
		    var newState = {}
		    newState['cite_available'] = data.cite_available;
		    newState['doc_list'] = data.doc_list;
		    newState['open'] = true;
		    parentThis.setState(newState);

		    console.log(parentThis.state);
	});		
    }


    render(){
	const docViewThis = this;
	const doc_list = this.state.doc_list;
	const cite_available = this.state.cite_available;
    	return(
            <div style={{paddingBottom: "1.5em", marginTop: 80}} className="col-md-12">
                <Card style={styles.card}>
                    <CardContent>
                        <Typography style={styles.title} align="center" color="primary" variant="headline">
                            {this.state.response_doc.title}  
                        </Typography>
			<div className="row">
			    <div className="col-md-6">
			    	<Typography style={styles.title} color="textSecondary">
			    	    Type: {this.state.response_doc.divtype}  
			    	</Typography>
			    	<Typography style={styles.title} color="textSecondary">
			    	    Author: {this.state.response_doc.author}  
			    	</Typography>
			    	<Typography style={styles.title} color="textSecondary">
			    	    Bench: {this.state.response_doc.bench}  
			    	</Typography>
			    	<Typography style={styles.title} color="textSecondary">
			    	    Source: {this.state.response_doc.source}  
			    	</Typography>
			    </div>
			    <div className="col-md-6" styles={{alignItems: 'right', display: 'flex'}}>
                        <Button  variant="raised" color="primary" onClick={this.showCites}>Show Citations</Button>

			    </div>
			</div>
                        <Typography style={styles.title} color="textSecondary">
                            Query based Summary:<br/> 
			    {this.state.response_doc.query_summary}  
                        </Typography>
			<Typography style={styles.title} color="textSecondary">
                            Summary:<br/> 
			    {this.state.response_doc.summary}  
                        </Typography>
                        <Typography style={styles.title} color="textSecondary">
                            Content:<br/>
 			    {this.state.response_doc.doc}  
                        </Typography>
                        
                    </CardContent>
                </Card>
      <Dialog
          open={this.state.open}
          onClose={this.handleClose}
	  fullWidth={true}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Documents Cited</DialogTitle>
          <DialogContent>
		{cite_available ? doc_list.map(function(d, idx){
			 return (<CaseCard {...docViewThis.props} title={d.title} tid={d.tid} key={d.tid} 
				bench={d.bench} source={d.source} highlights={d.highlights} doc_type={d.divtype} />)
		       })
		:
		<p>No cited documents available</p>	}
         </DialogContent>
          <DialogActions>
	    <Button onClick={this.handleClose} color="primary">
		Cancel
            </Button>
          </DialogActions>
        </Dialog>

            </div>
        );

    }
}

