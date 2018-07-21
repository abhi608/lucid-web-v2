import React from 'react';
import PropTypes from 'prop-types';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';


/* application components */
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

/* global styles for app */
import './styles/app.scss';
import CssBaseline from '@material-ui/core/CssBaseline';

import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

const theme = createMuiTheme(
	{
	    palette:{
     primary: {
      main: '#1a237e',
    },
    secondary: {
      main: '#84ffff',
    },
     background: {
      default: "#757de8"
    }
  },
  
	}
	    );

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
    static propTypes = {
        children: PropTypes.node,
    };

    render() {
        return (
             <MuiThemeProvider theme={theme}>
		<CssBaseline />
                <section>
                    <Header {...this.props}/>
                    <div
                      className="container"
                      style={{ marginTop: 10, paddingBottom: 250 }}
                    >
                        {this.props.children}
                    </div>
                    <div>
                        <Footer />
                    </div>
                </section>
            </MuiThemeProvider>
        );
    }
}

export { App };
