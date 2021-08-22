import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import 'react-tsparticles';
import { GlobalStyle } from '../styles/global-styles';

import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';
import { HomePageTop2 } from './pages/HomepageTop2/Loadable';
import { ContactPage } from './pages/ContactPage/Loadable';

export function App() {
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - Truong.Nat"
        defaultTitle="Homepage"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="Portfolio" content="Portfolio peanut" />
      </Helmet>

      <Switch>
        <Route
          exact
          path={process.env.PUBLIC_URL + '/'}
          component={HomePageTop2}
        />
        <Route
          exact
          path={process.env.PUBLIC_URL + '/contact'}
          component={ContactPage}
        />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
