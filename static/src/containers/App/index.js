import React from 'react';
import PropTypes from 'prop-types';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

/* application components */
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

/* global styles for app */
import './styles/app.scss';

const theme = createMuiTheme({
    palette: {
        type: 'light'
    }
});

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
    static propTypes = {
        children: PropTypes.node,
    };

    render() {
        return (
            // <MuiThemeProvider muiTheme={theme}>
                <section>
                    <Header {...this.props}/>
                    <div
                      className="container"
                      style={{ marginTop: 10, paddingBottom: 250, zIndex: 1 }}
                    >
                        {this.props.children}
                    </div>
                    <div>
                        <Footer />
                    </div>
                </section>
            // </MuiThemeProvider>
        );
    }
}

export { App };
