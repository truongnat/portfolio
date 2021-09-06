import * as React from 'react';
import styled from 'styled-components/macro';
import { NavBar } from '../../components/NavBar';
import { Helmet } from 'react-helmet-async';
import { AboutHeader } from './Features/AboutHeader';
import { AboutMe } from './Features/AboutMe';
import { Experience } from './Features/Experience';
import { Skills } from './Features/Skills';
import { media } from '../../../styles/media';

export function AboutPage() {
  return (
    <React.Fragment>
      <Helmet>
        <title>About Page</title>
        <meta name="About Page" content="About page for Truong.Nat" />
      </Helmet>
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

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #0e0a0a;
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
