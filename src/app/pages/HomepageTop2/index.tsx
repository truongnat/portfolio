import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from '../../components/NavBar';
import { NavDesktop } from './components/NavDesktop';
import { SubTitle } from './components/SubTitle';
import { Title } from './components/Title';
import { Container, Wrapper } from './components/Wrapper';

export function HomePageTop2() {
  return (
    <React.Fragment>
      <Helmet>
        <title>Home Page</title>
        <meta name="Home Page" content="My page for Truong.Nat" />
      </Helmet>
      <Wrapper>
        <Container>
          <NavBar menuDesktop={false} />
          <Title>Truong.Nat</Title>
          <SubTitle>WORKER | DEVELOPER | SHIPPER</SubTitle>
          <NavDesktop />
        </Container>
      </Wrapper>
    </React.Fragment>
  );
}
