import * as React from 'react';
import styled from 'styled-components/macro';

const SKILLS = [
  {
    label: 'Frontend',
    child: [
      'HTML & CSS : 08/10',
      'Bootstrap : 7/10',
      'Javascript : 7/10',
      'Typescript : 5/10',
      'Tailwind CSS : 5/10',
      'ReactJS : 07/10',
      'NextJs : 5/10',
      'Vue js : 5/10',
      'Styled-components : 5/10',
      'Redux : 8/10',
    ],
  },
  {
    label: 'Mobile',
    child: ['React Native : 5/10', 'Native Base : 5/10'],
  },
  {
    label: 'Backend',
    child: ['ExpressJs : 5/10', 'Nest js : 4/10', 'RESTFUL  API : 5/10'],
  },
  {
    label: 'Database',
    child: ['Mongo DB  : 7/10', 'Realm Db : 7/10'],
  },
  {
    label: 'Tools',
    child: [
      'Git/Github  : 6/10',
      'GitLab : 6/10',
      'Figma : 5/10',
      'Jira',
      'Trello',
      'Redmine',
      'Opms',
    ],
  },
  {
    label: 'Communicate',
    child: ['Slack', 'Skype', 'Google Meet', 'Zoom'],
  },
];

export function Skills() {
  return (
    <Wrapper>
      <Label>Skills</Label>
      <Content>
        {SKILLS.map((item, index) => (
          <List key={index}>
            <ItemLabel>{item.label}</ItemLabel>
            {item.child.map((child, iChild) => (
              <Item key={iChild}>
                <ItemText>{child}</ItemText>
              </Item>
            ))}
          </List>
        ))}
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
  font-weight: 500;
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
  padding: 0.5rem 0;
  list-style-type: none;
`;

const ItemLabel = styled.div`
  font-size: 1rem;
  font-weight: 500;
  border-bottom: 1px solid #b0afaf;
  padding: 0.2rem 1rem;
`;

const ItemText = styled.div`
  font-size: 0.85rem;
  font-weight: 400;
  border-bottom: 1px solid rgba(209, 213, 219, 1);
`;

const Item = styled.li`
  padding: 0.5rem 2rem 0 2rem;
  &:last-child ${ItemText} {
    border-bottom: none;
  }
`;
