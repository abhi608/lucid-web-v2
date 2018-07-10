import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Switch, Redirect} from 'react-router';

// import Paper from '@material-ui/core/Paper';

import * as actionCreators from '../actions/auth';
import CaseCard from './CaseCard'
import ResultsDrawer from './ResultsDrawer'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

const styles = {
    card: {
      flex: 1,
      minWidth: 275,
      paddingBottom: "1.5em",
      marginTop: 20,
      marginLeft: 150
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
    }
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

        this.state = {
            response_doc: {
                request_completed: false
            }
        }
        // var parentThis = this;
        // console.log("Props: ", this.props);
        // var search = this.props.location.search;
        // if(search.charAt(0) == '?'){
        //     search = search.substr(1);
        // }
        // var tid = search.split("=")[1];
        // console.log("tid: ", tid);
        // fetch("/api/fetchdoc?tid="+tid, {
		// 	method: "GET",
		// }).then((resp) => resp.json()).
		// then(function(data){
		// 	console.log("data-init state: ", data);
		// 	parentThis.setState(data);
		// });

	    // console.log("init state",this.props.location.state.response);
        // this.state = this.props.location.state.response;    
    }

    componentWillMount() {
        var parentThis = this;
        console.log("Props: ", this.props);
        var search = this.props.location.search;
        if(search.charAt(0) == '?'){
            search = search.substr(1);
        }
        var tid = search.split("=")[1];
        console.log("tid: ", tid);
        fetch("/api/fetchdoc?tid="+tid, {
			method: "GET",
		}).then((resp) => resp.json()).
		then(function(data){
			console.log("data-init state: ", data);
			parentThis.setState(data);
		});
    }


    render(){
        if(this.state.response_doc.request_completed){
            return(
                <div>
                    <ResultsDrawer  {...this.props} />
                    <Card style={styles.card}>
                        <CardContent>
                            <Typography style={styles.title} align="center" color="primary" variant="headline">
                                {this.state.response_doc.title}  
                            </Typography>
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
                            <Typography style={styles.title} color="textSecondary">
                                Summary: {this.state.response_doc.summary}  
                            </Typography>
                            <Typography style={styles.title} color="textSecondary">
                                Query based Summary: {this.state.response_doc.query_summary}  
                            </Typography>
                            <Typography style={styles.title} color="textSecondary">
                                Content: {this.state.response_doc.doc}  
                            </Typography>
                            {/* <Typography variant="headline" component="h2">
                        {this.props.title}
                            </Typography>
                            <Typography style={styles.pos} color="textSecondary">
                                    {this.props.bench},{this.props.source}
                            </Typography>
                            <Typography component="p">
                                {this.props.highlights} 
                            </Typography> */}
                        </CardContent>
                        {/* <CardActions>
                            <Button size="small" onClick={this.showDocument}>View More</Button>
                        </CardActions> */}
                    </Card>
                </div>
            );
        }
        else{
            return(
                <div style={{paddingBottom: "1.5em", marginTop: 80}} className="col-md-12">
                    <p>Loading...</p>
                </div>
            );
        }

    }
}

