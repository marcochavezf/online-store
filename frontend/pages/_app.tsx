/* eslint-disable react/jsx-props-no-spreading */
import { ApolloProvider } from '@apollo/client';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropType from 'prop-types';
import React, { useEffect } from 'react';
import Page from '../components/layout/Page';
import '../components/styles/nprogress.css';
import { CartStateProvider } from '../lib/providers/cartState';
import { DrawerStateProvider } from '../lib/providers/drawerState';
import withData from '../lib/withData';
import theme from '../theme';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps, apollo }) {
  
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ApolloProvider client={apollo}>
      <ThemeProvider theme={theme}>
        
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {/* <LinearProgress style={{ zIndex: 9999 }} /> */}
        <CartStateProvider>
          <DrawerStateProvider>
            {/* <LinearProgress style={{ zIndex: 9999, position: 'fixed', width: '100%' }} color="secondary" /> */}
            <Page>
              <Component {...pageProps} />
            </Page>
          </DrawerStateProvider>
        </CartStateProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return { pageProps };
};

MyApp.propTypes = {
  Component: PropType.any,
  pageProps: PropType.any,
  apollo: PropType.any,
};

export default withData(MyApp);
