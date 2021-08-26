import * as React from 'react';
import styled from 'styled-components/macro';
import { FcCheckmark } from 'react-icons/fc';

export function AboutMe() {
  return (
    <Wrapper>
      <Label>About Me</Label>
      <Content>
        <List>
          <Item>
            <FcCheckmark size={20} />
            <Text>Funny</Text>
          </Item>
          <Item>
            <FcCheckmark size={20} />
            <Text>Sociable</Text>
          </Item>
          <Item>
            <FcCheckmark size={20} />
            <Text>Always work hard</Text>
          </Item>
          <Item>
            <FcCheckmark size={20} />
            <Text>Never stop learning</Text>
          </Item>
        </List>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding: 0 2rem;
  margin: 1.5rem 0;
`;
const Label = styled.div`
  font-size: 1.2rem;
  color: #fff;
  margin: 0.2rem 0;
`;

const Content = styled.div`
  width: 100%;
  background-color: #fff;
  border-radius: 0.25rem;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  padding: 1rem 1.5rem;
  list-style-type: none;
`;
const Item = styled.li`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 0.25rem 0;
`;

const Text = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  margin-left: 0.5rem;
`;
