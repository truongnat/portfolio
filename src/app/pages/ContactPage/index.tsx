import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components/macro';
import { NavBar } from '../../components/NavBar';
import { ContactForm } from './components/ContactForm';

export function ContactPage() {
  return (
    <React.Fragment>
      <Helmet>
        <title>Contact Page</title>
        <meta name="Contact Page" content="Contact page for Truong.Nat" />
      </Helmet>
      <Wrapper>
        <NavBar />
        <Container>
          <ContactForm />
        </Container>
      </Wrapper>
    </React.Fragment>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: #0e0a0a;
  align-items: center;
  justify-content: center;
`;

export const Container = styled(Wrapper)`
  height: 100%;
  flex-direction: column;
`;
