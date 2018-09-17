/* eslint new-cap: 0 */

import React from 'react';
import { Route } from 'react-router';

/* containers */
import { App } from './containers/App';
import { HomeContainer } from './containers/HomeContainer';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import ProtectedView from './components/ProtectedView';
import Analytics from './components/Analytics';
import NotFound from './components/NotFound';
import SearchView from './components/SearchView';
import ResultsView from './components/ResultsView';
import DocView from './components/DocView';


import { DetermineAuth } from './components/DetermineAuth';
import { requireAuthentication } from './components/AuthenticatedComponent';
import { requireNoAuthentication } from './components/notAuthenticatedComponent';

export default (
    <Route path="/" component={App}>
        <Route path="main" component={requireAuthentication(ProtectedView)} />
        <Route path="login" component={requireNoAuthentication(LoginView)} />
        <Route path="register" component={requireNoAuthentication(RegisterView)} />
        <Route path="home" component={requireNoAuthentication(HomeContainer)} />
        <Route path="analytics" component={requireAuthentication(Analytics)} />
        <Route path="search" component={requireNoAuthentication(SearchView)} />
        <Route path="results" component={requireNoAuthentication(ResultsView)} />
        <Route path="resultsScc" component={requireNoAuthentication(ResultsView)} />
        <Route path="doc" component={requireNoAuthentication(DocView)} />
        <Route path="docScc" component={requireNoAuthentication(DocView)} />
	<Route path='form' component={() => window.location = 'https://goo.gl/forms/nSOR4qHURBrJP7kb2'}/>
        <Route path="*" component={DetermineAuth(NotFound)} />
    </Route>
);
