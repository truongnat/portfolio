import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import Particles from 'react-particles-js';
import { animated, useTransition } from 'react-spring';
import { useMedia } from 'react-use';
import styled from 'styled-components/macro';
import { NavBar } from '../../components/NavBar';

export function ContactPage() {
  const ref = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const [items, set] = React.useState<string[]>([]);

  const isLg = useMedia('(min-width: 768px)');
  const isMedium = useMedia('(min-width: 1024px)');
  const particlesVal = isMedium ? 100 : isLg ? 50 : 20;

  const transitions = useTransition(items, {
    from: {
      opacity: 0,
      height: 0,
      innerHeight: 0,
      transform: 'perspective(600px) rotateX(0deg)',
      color: '#8fa5b6',
    },
    enter: [
      { opacity: 1, height: 80, innerHeight: 80 },
      { transform: 'perspective(600px) rotateX(180deg)', color: '#28d79f' },
      { transform: 'perspective(600px) rotateX(0deg)' },
    ],
    leave: [
      { color: '#c23369' },
      { innerHeight: 0 },
      { opacity: 0, height: 0 },
    ],
    update: { color: '#28b4d7' },
  });

  const reset = React.useCallback(() => {
    ref.current.forEach(clearTimeout);
    ref.current = [];
    set([]);
    ref.current.push(
      setTimeout(() => set(['Apples', 'Oranges', 'Kiwis']), 2000),
    );
    ref.current.push(setTimeout(() => set(['Apples', 'Kiwis']), 5000));
    ref.current.push(
      setTimeout(() => set(['Apples', 'Bananas', 'Kiwis']), 8000),
    );
  }, []);

  React.useEffect(() => {
    reset();
    return () => ref.current.forEach(clearTimeout);
  }, [reset]);

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
          <Main>
            {transitions(({ innerHeight, ...rest }, item) => (
              <TransitionItem style={rest} onClick={reset}>
                <animated.div
                  style={{ overflow: 'hidden', height: innerHeight }}
                >
                  {item}
                </animated.div>
              </TransitionItem>
            ))}
          </Main>
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

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Main = styled.div`
  margin: 0 auto;
  height: 260px;
`;
const TransitionItem = styled(animated.div)`
  overflow: hidden;
  width: 100%;
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 2em;
  font-weight: 800;
  text-transform: uppercase;
  will-change: transform, opacity, height;
  white-space: nowrap;
  cursor: pointer;
  line-height: 80px;
`;
