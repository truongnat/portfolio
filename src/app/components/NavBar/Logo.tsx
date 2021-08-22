import * as React from 'react';
import styled from 'styled-components/macro';

export function Logo() {
  return (
    <Wrapper>
      <Title>Peanut</Title>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  z-index: 10;
`;

const Title = styled.div`
  font-size: 1.5rem;
  /* color: ${p => p.theme.text}; */
  color: #fff;
  font-weight: bold;
  cursor: pointer;
`;
