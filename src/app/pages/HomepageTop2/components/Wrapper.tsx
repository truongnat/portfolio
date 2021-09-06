import styled from 'styled-components/macro';

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: #0e0a0a;
  align-items: center;
  justify-content: center;
`;

export const Container = styled(Wrapper)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
