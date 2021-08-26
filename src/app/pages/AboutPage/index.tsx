import * as React from 'react';
import styled from 'styled-components/macro';
import { useMedia } from 'react-use';
import Particles from 'react-particles-js';
import { NavBar } from '../../components/NavBar';
import { Helmet } from 'react-helmet-async';
import { AboutHeader } from './Features/AboutHeader';
import { AboutMe } from './Features/AboutMe';
import { Experience } from './Features/Experience';
import { Skills } from './Features/Skills';
import { media } from '../../../styles/media';

export function AboutPage() {
  const isLg = useMedia('(min-width: 768px)');
  const isMedium = useMedia('(min-width: 1024px)');
  const particlesVal = isMedium ? 50 : isLg ? 30 : 10;

  return (
    <React.Fragment>
      <Helmet>
        <title>About Page</title>
        <meta name="About Page" content="About page for Truong.Nat" />
      </Helmet>
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
      <Wrapper>
        <NavBar />
        <Container>
          <AboutHeader />
          <FlexCol2>
            <WrapperFlex>
              <AboutMe />
              <Experience />
            </WrapperFlex>
            <Skills />
          </FlexCol2>
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

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #1d1d25;
  align-items: center;
  justify-content: center;
`;
export const Container = styled(Wrapper)`
  flex-direction: column;
  margin-top: 7rem;
`;

const WrapperFlex = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FlexCol2 = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${media.lg`
  flex-direction: row;
  align-items: flex-start;
  `}
`;
