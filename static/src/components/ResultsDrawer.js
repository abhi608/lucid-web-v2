import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';

import Drawer from '@material-ui/core/Drawer';
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
        zIndex: 1,
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        minWidth: 0, // So the Typography noWrap works
    },
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ResultsDrawer extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div>
                <Drawer variant="permanent" style={styles.drawerPaper}>
                        <Typography variant="display1" style={styles.heading}> Search Results </Typography>
                        <Divider />
                        <List component="nav">
                            <ListItem button>
                                <ListItemIcon>
                                    <BulletIcon />
                                </ListItemIcon>
                                <ListItemText primary="Document 2" />
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
                    </Drawer>
                </div>
        );

    }
}