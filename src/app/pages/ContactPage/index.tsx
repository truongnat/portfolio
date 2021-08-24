import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import Particles from 'react-particles-js';
import { useMedia } from 'react-use';
import styled from 'styled-components/macro';
import { NavBar } from '../../components/NavBar';
import { ContactForm } from './components/ContactForm';

export function ContactPage() {
  const isLg = useMedia('(min-width: 768px)');
  const isMedium = useMedia('(min-width: 1024px)');
  const particlesVal = isMedium ? 100 : isLg ? 50 : 20;

  return (
    <React.Fragment>
      <Helmet>
        <title>Contact Page</title>
        <meta name="Contact Page" content="Contact page for Truong.Nat" />
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
          <ContactForm />
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
  height: 100vh;
  display: flex;
  background-color: #1d1d25;
  align-items: center;
  justify-content: center;
`;

export const Container = styled(Wrapper)`
  height: 100%;
  flex-direction: column;
`;
