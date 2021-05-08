import PropTypes from 'prop-types';
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Cart from '../cart/Cart';
import PersistentDrawerLeft from './PersistentDrawerLeft';

const GlobalStyles = createGlobalStyle`
  html {
    --red: #ff0000;
    --black: #393939;
    --grey: #3A3A3A;
    --gray: var(--grey);
    --lightGrey: #e1e1e1;
    --lightGray: var(--lightGrey);
    --offWhite: #ededed;
    --maxWidth: 1000px;
    --bs: 0 12px 24px 0 rgba(0,0,0,0.09);
  }
`;

const InnerStyles = styled.div`
  max-width: var(--maxWidth);
  margin: 0 auto;
  padding: 2rem;
`;

export default function Page({ children }) {
  return (
    <div>
      <GlobalStyles />
      {/* <Header /> */}
      {/* <InnerStyles>{children}</InnerStyles> */}
      <PersistentDrawerLeft >
        {children}
      </PersistentDrawerLeft>
      <Cart />
    </div>
  );
}

Page.propTypes = {
  cool: PropTypes.string,
  children: PropTypes.any,
};
