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
import { List, ListItem } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { parseJSON } from '../utils/misc';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const classes = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    heading: {
        // fontSize: "2rem",
    },
    foldable: {
        width: '100%',
    },
    card: {
        maxWidth: 345,
        // minWidth: 250,
        // width: 100
    },
});

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

        this.state = {
            response_doc: {
                request_completed: false
            },
            showCiteList: false,
            showCitedByList: false,
        };
        // this.showCites = this.showCites.bind(this); 
    }

    componentWillMount() {
        var parentThis = this;
        console.log("Props: ", this.props);
        var search = this.props.location.search;
        if(search.charAt(0) == '?'){
            search = search.substr(1);
        }
        var tid = search.split(/[=&]+/)[1];
        var req = "/api/fetchdoc?tid="+tid;
        if(search.includes("&")){
            var query = search.split(/[=&]+/)[3];
            console.log("query: ", query);
            req = req+"&query="+query;
        }
        console.log("Query", query);
        // var query = search.split(/[=&]+/)[3];
        console.log("tid: ", tid);
        fetch(req, {
			method: "GET",
		}).then((resp) => resp.json()).
		then(function(data){
            console.log("data-init state: ", data);
            data['open'] = false;
            data['cite_available'] = false;
            data['doc_list'] = [];
            data.response_doc.query_summary = "Loading..."
            parentThis.setState(data);
            // var query_summary_url = 'http://35.226.140.185:80/query_summarize?key=AIzaSyBGktXQ3IPpwymVSAko08kxbIY4UcGQorw';
	        var query_summary_url = '/api/query_summarize'
            var payload = {
                "doc": data.response_doc.doc,
                "query": query
            };
            var headers = {
                'Content-Type': 'application/json'
            };
            try{
                console.log("trying to hit summary server");
                fetch(query_summary_url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                    // timeout: 400
                }).then((response) => response.json())
                .then(function(query_summarize){
		            console.log("lololol: ", query_summarize)
                    var query_summary = query_summarize.query_summary;
                    console.log("query summary: ", query_summary);
                    data.response_doc.query_summary = query_summary;
                    parentThis.setState(data);
                }).catch(function(err) {
		            console.log(err)
                    data.response_doc.query_summary = 'Query based summary not available';
                    parentThis.setState(data);
                });
                
                // then((response) => response.json()).
                // then(function(query_summary){
                //     console.log("query summary: ", query_summary, data);
                //     data.response_doc.query_summary = query_summary;
                //     parentThis.setState(data); 
                // });
            }
            catch(err){
                console.log("error in summary server: ", err);
                data.response_doc.query_summary = 'Query based summary not available';
                parentThis.setState(data); 
            }
            
        });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    openCiteList = () => {
        this.setState({showCiteList: true});
    }

    closeCiteList = () => {
        this.setState({showCiteList: false});
    }

    openCitedByList = () => {
        this.setState({showCitedByList: true});
    }

    closeCitedByList = () => {
        this.setState({showCitedByList: false});
    }





    render(){
        const docViewThis = this;
        const doc_list = this.state.doc_list;
        const cite_available = this.state.cite_available;
        console.log("this.state.response_doc: ", this.state.response_doc);
        var citeList = [{'tid': null, 'url': null, 'title': null, 'msg': 'No Citation available'}];
        var citedByList = [{'tid': null, 'url': null, 'title': null, 'msg': 'No Cited by document available'}];
        if(this.state.response_doc.citeList && this.state.response_doc.citeList.length > 0) {
            citeList = this.state.response_doc.citeList;
        }

        if(this.state.response_doc.citedbyList && this.state.response_doc.citedbyList.length > 0) {
            citedByList = this.state.response_doc.citedbyList;
        }
        if(this.state.response_doc.request_completed){
            return(
                <div style={{paddingBottom: "1.5em", marginTop: 80}} className="col-md-12">

                    <div>
                        <Dialog
                        fullWidth
                        maxWidth='md'
                        open={this.state.showCiteList}
                        onClose={this.closeCiteList}
                        aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Citations</DialogTitle>
                            <DialogContent style={{minHeight: '75%'}}>
                                <div className={classes.root}>
                                    {this.state.response_doc.citeList.length == 0?
                                        <em>No citations available</em>:
                                        <List>
                                        {this.state.response_doc.citeList.map(function(d, idx){
                                            return (<div>
                                                <div><strong>Title:</strong> {d.title}</div>
                                                {d.url?
                                                    <div><strong>Link:</strong> <a href={d.url}>{d.url}</a></div>:
                                                    console.log("url not found")
                                                }
                                                <li>
                                                    <Divider/>
                                                </li>
                                                <br/>
                                            </div>)
                                        })}
                                        </List>
                                    }
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.closeCiteList} color="primary">
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>

                    <div>
                        <Dialog
                        fullWidth
                        maxWidth='md'
                        open={this.state.showCitedByList}
                        onClose={this.closeCitedByList}
                        aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Cited by</DialogTitle>
                            <DialogContent style={{minHeight: '75%'}}>
                                <div className={classes.root}>
                                    {this.state.response_doc.citedbyList.length == 0?
                                        <em>No cited by documents available</em>:
                                        <List>
                                        {this.state.response_doc.citedbyList.map(function(d, idx){
                                            return (<div>
                                                <div><strong>Title:</strong> {d.title}</div>
                                                {d.url?
                                                    <div><strong>Link:</strong> <a href={d.url}>{d.url}</a></div>:
                                                    console.log("url not found")
                                                }
                                                <li>
                                                    <Divider/>
                                                </li>
                                                <br/>
                                            </div>)
                                        })}
                                        </List>
                                    }
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.closeCitedByList} color="primary">
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>

                    <Card style={styles.card}>
                        <CardContent style={{backgroundColor: "#f8f8f8"}}>
                            <Typography style={styles.title} align="center" color="primary" variant="headline">
                                <div style={{fontSize: 18}} dangerouslySetInnerHTML={{__html: "<h4><strong>"+this.state.response_doc.title + "</strong></h4>"}}></div>
                            </Typography>

                            <div className="row">
                                <div className="col-md-6">
                                    <Card className={classes.card}>
                                        <CardContent>
                                            <Typography gutterBottom variant="headline" component="h2">
                                                Type
                                            </Typography>
                                            <Typography component="p">
                                                <div style={{fontSize: 10}} dangerouslySetInnerHTML={{__html: this.state.response_doc.divtype}}></div>
                                            </Typography>
                                            <br/>
                                            <Divider/>
                                            <br/>
                                            <Typography gutterBottom variant="headline" component="h2">
                                                Author
                                            </Typography>
                                            <Typography component="p">
                                                <div style={{fontSize: 10}} dangerouslySetInnerHTML={{__html: this.state.response_doc.author}}></div>
                                            </Typography>
                                            <br/>
                                            <Divider/>
                                            <br/>
                                            <Typography gutterBottom variant="headline" component="h2">
                                                Bench
                                            </Typography>
                                            <Typography component="p">
                                                <div style={{fontSize: 10}} dangerouslySetInnerHTML={{__html: this.state.response_doc.bench}}></div>
                                            </Typography>
                                            <br/>
                                            <Divider/>
                                            <br/>
                                            <Typography gutterBottom variant="headline" component="h2">
                                                Source
                                            </Typography>
                                            <Typography component="p">
                                                <div style={{fontSize: 10}} dangerouslySetInnerHTML={{__html: this.state.response_doc.source}}></div>
                                            </Typography>
                                            {/* <br/>
                                            <Divider/>
                                            <br/> */}
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="col-md-6 col-offset-6">
                                    <Card className={classes.card}>
                                        <CardContent>
                                            <Button variant="contained" size="medium" onClick={this.openCiteList} color="secondary">Citations</Button>
                                            <br/>
                                            {/* <Divider/> */}
                                            <br/>
                                            <Button variant="contained" size="medium" onClick={this.openCitedByList} color="secondary">Cited By</Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                            <br/>
                            <br/>
                            <div className="row">
                                <div className="col-md-12">
                                    <Card className={classes.card}>    
                                        <div className={classes.foldable}>
                                            <ExpansionPanel>
                                                <ExpansionPanelSummary style={{height: 5}} expandIcon={<ExpandMoreIcon />}>
                                                <Typography className={classes.heading}>
                                                    <div dangerouslySetInnerHTML={{__html: "<h5><strong>Query Based Summary</strong></h5>"}}></div>
                                                </Typography>
                                                </ExpansionPanelSummary>
                                                <ExpansionPanelDetails>
                                                <Typography>
                                                    <div style={{fontSize: 14, display: 'block', maxHeight: 400, overflow:'auto'}} dangerouslySetInnerHTML={{__html: this.state.response_doc.query_summary}}></div>
                                                </Typography>
                                                </ExpansionPanelDetails>
                                            </ExpansionPanel>
                                        </div>
                                    </Card>

                                    <br/>
                                    <br/>

                                    <Card className={classes.card}>    
                                        <div className={classes.foldable}>
                                            <ExpansionPanel>
                                                <ExpansionPanelSummary style={{height: 5}} expandIcon={<ExpandMoreIcon />}>
                                                <Typography className={classes.heading}>
                                                    <div dangerouslySetInnerHTML={{__html: "<h5><strong>Document Summary</strong></h5>"}}></div>
                                                </Typography>
                                                </ExpansionPanelSummary>
                                                <ExpansionPanelDetails>
                                                <Typography>
                                                    <div style={{fontSize: 14, display: 'block', maxHeight: 400, overflow:'auto'}} dangerouslySetInnerHTML={{__html: this.state.response_doc.summary}}></div>
                                                </Typography>
                                                </ExpansionPanelDetails>
                                            </ExpansionPanel>
                                        </div>
                                    </Card>    

                                    <br/>
                                    <br/>

                                    <Card className={classes.card}>    
                                        <div className={classes.foldable}>
                                            <ExpansionPanel>
                                                <ExpansionPanelSummary style={{height: 5}} expandIcon={<ExpandMoreIcon />}>
                                                <Typography className={classes.heading}>
                                                    <div dangerouslySetInnerHTML={{__html: "<h5><strong>Document</strong></h5>"}}></div>
                                                </Typography>
                                                </ExpansionPanelSummary>
                                                <ExpansionPanelDetails>
                                                <Typography>
                                                    <div style={{fontSize: 10, display: 'block', maxHeight: 650, overflow:'auto'}} dangerouslySetInnerHTML={{__html: this.state.response_doc.doc}}></div>
                                                </Typography>
                                                </ExpansionPanelDetails>
                                            </ExpansionPanel>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                            
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
        else{
            return(
                <div style={{paddingBottom: "1.5em", marginTop: 80}} className="col-md-12">
                    <p>Loading...</p>
                </div>
            );
        }

    }
}

