import React from 'react';
import styled from 'styled-components';
import { Gallery } from './components/Gallery';
import { NavBar } from '../../components/NavBar';
import { Helmet } from 'react-helmet-async';

export function ArtPage() {
  return (
    <React.Fragment>
      <Helmet>
        <title>Art Page</title>
        <meta name="Art Page" content="Art page for Truong.Nat" />
      </Helmet>
      <Wrapper>
        <NavBar />
        <Gallery />
      </Wrapper>
    </React.Fragment>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1d1d25;
  align-items: center;
  justify-content: center;
`;
