import * as React from 'react';
import Particles from 'react-particles-js';
import 'react-tsparticles';
import { Helmet } from 'react-helmet-async';
import { NavDesktop } from './components/NavDesktop';
import { NavMobile } from './components/NavMobile';
import { SubTitle } from './components/SubTitle';
import { Title } from './components/Title';
import { Container, Wrapper } from './components/Wrapper';
import styled from 'styled-components';
import { useMedia } from 'react-use';

export function HomePageTop2() {
  const isLg = useMedia('(min-width: 768px)');
  const isMedium = useMedia('(min-width: 1024px)');
  const particlesVal = isMedium ? 100 : isLg ? 50 : 20;
  return (
    <React.Fragment>
      <Helmet>
        <title>Home Page</title>
        <meta name="Home Page" content="My page for Truong.Nat" />
      </Helmet>
      <Wrapper>
        <WrapParticles
          params={{
            particles: {
              number: {
                value: particlesVal,
              },
              size: {
                value: 1,
              },
            },
            interactivity: {
              events: {
                onhover: {
                  enable: true,
                  mode: 'repulse',
                },
              },
            },
          }}
        />
        <Container>
          <Title>Truong.Nat</Title>
          <SubTitle>WORKER | DEVELOPER | SHIPPER</SubTitle>
          <NavMobile />
          <NavDesktop />
        </Container>
      </Wrapper>
    </React.Fragment>
  );
}

const WrapParticles = styled(Particles)`
  height: 100%;
  width: 100%;
  position: fixed;
`;
