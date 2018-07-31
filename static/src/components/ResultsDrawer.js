import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';

import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import BulletIcon from '@material-ui/icons/ImportContacts';
import Typography from '@material-ui/core/Typography';

function mapStateToProps(state) {
    return {
        isAuthenticating: state.auth.isAuthenticating,
        statusText: state.auth.statusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const drawerWidth = 50;

const styles = {
    heading:{
        paddingLeft: 15,
        paddingTop: 10,
        paddingBottom: 10
    },
    drawerPaper: {
        zIndex: 10,
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        minWidth: 0, // So the Typography noWrap works
    },
};

const docList = (
    <div style={{maxWidth: 300, width: 'auto'}}>
        <List component="nav">
            <ListItem button>
                <ListItemIcon>
                    <BulletIcon />
                </ListItemIcon>
                <ListItemText primary="Document 2 is really long. I want to see if the text wraps around." />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <BulletIcon />
                </ListItemIcon>
                <ListItemText primary="Document 3" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <BulletIcon />
                </ListItemIcon>
                <ListItemText primary="Document 4" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <BulletIcon />
                </ListItemIcon>
                <ListItemText primary="Document 5" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <BulletIcon />
                </ListItemIcon>
                <ListItemText primary="Document 6" />
            </ListItem>
        </List>
    </div>
);

@connect(mapStateToProps, mapDispatchToProps)
export default class ResultsDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.drawerOpen = true;
        this.toggleDrawer = this.toggleDrawer.bind(this);
    }

    toggleDrawer(open) {
        this.drawerOpen = open;
        console.log('Results drawer toggled')
    }

    render(){
        return(
            <div style={{ zIndex: 10 }}>
                <Drawer variant="permanent" style={styles.drawerPaper}>
                        <Typography variant="display1" style={styles.heading}> Search Results </Typography>
                        <Divider />
                        {docList}
                </Drawer>
            </div>
            /*<SwipeableDrawer
                open={this.drawerOpen}
                onClose={this.toggleDrawer(false)}
                onOpen={this.toggleDrawer(true)}
            >
                <div
                    tabIndex={0}
                    role="button"
                    onClick={this.toggleDrawer('left', false)}
                    onKeyDown={this.toggleDrawer('left', false)}
                >
                {this.docList}
                </div>
            </SwipeableDrawer>*/
        );

    }
}