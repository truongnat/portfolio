import React from 'react';
import Particles from 'react-particles-js';
import styled from 'styled-components';
import { useMedia } from 'react-use';
import { Gallery } from './components/Gallery';
import { NavBar } from '../../components/NavBar';
import { animated, useSpring } from 'react-spring';

export function ArtPage() {
  const isLg = useMedia('(min-width: 768px)');

  const isMedium = useMedia('(min-width: 1024px)');
  const particlesVal = isMedium ? 100 : isLg ? 50 : 20;
  const propsLef = useSpring({
    from: {
      x: -200,
    },
    to: {
      x: 0,
    },
  });

  return (
    <React.Fragment>
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
          <Title style={propsLef}>Art Page</Title>
          <Gallery />
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
`;

export const Title = styled(animated.h1)`
  color: #7b4397;
  font-size: 1.75rem;
  margin: 2rem 0;
  margin-top: 7rem;
`;
