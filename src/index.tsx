import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { createBrowserHistory } from 'history';
import './index.css';
import { Header } from './component/Header';
import PrivateRoute from './component/PrivateRoute';
import Index from './pages/Index';
import AdminIndex from './pages/admin/Index';
import CallbackSignIn from './pages/callback/SignIn';
import Post from './pages/posts/Post';

export const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="webdonalds.jp.auth0.com"
      clientId="HEZpsp1uFFKuhAkiYgMygS2wD0GlEC3f"
      redirectUri={`${window.location.origin}/callback/signin`}
      onRedirectCallback={(appState) => {
        history.replace(appState?.returnTo || window.location.pathname);
      }}
    >
      <div className="min-h-screen bg-gray-000 text-gray-700 text-lg">
        <div className="max-w-6xl mx-auto px-2 md:px-4">
          <Header />
          <Router history={history}>
            <Switch>
              <PrivateRoute path="/admin" component={AdminIndex} />
              <Route path="/callback/signin" component={CallbackSignIn} />
              <Route path="/posts/:id?" component={Post} />
              <Route path="/" component={Index} exact />
            </Switch>
          </Router>
        </div>
      </div>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
