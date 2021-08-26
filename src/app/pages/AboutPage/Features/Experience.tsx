import * as React from 'react';
import styled from 'styled-components/macro';
import Ntq from '../assets/ntq.png';
import School from '../assets/school.png';
export function Experience() {
  return (
    <Wrapper>
      <Label>Experience</Label>
      <Content>
        <List>
          <Item>
            <ItemLeft>
              <ItemImage src={Ntq} alt="ntq" />
            </ItemLeft>
            <ItemRight>
              <LevelName>Frontend Developer</LevelName>
              <CompanyName>NTQ Solution JSC . Full-time</CompanyName>
              <WorkTime>Oct 2020 – Present</WorkTime>
              <AddressName>Me Tri, Hanoi, Vietnam</AddressName>
            </ItemRight>
          </Item>
          <Item>
            <ItemLeft>
              <ItemImage src={School} alt="School" />
            </ItemLeft>
            <ItemRight>
              <LevelName>Student</LevelName>
              <CompanyName>Bach Nghe High School. Part-time</CompanyName>
              <WorkTime>Oct 2019 – Present</WorkTime>
              <AddressName>Thanh Xuan, Hanoi, Vietnam</AddressName>
            </ItemRight>
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
  list-style-type: none;
`;
const Item = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #b0afaf;
  width: 100%;
  padding: 1rem;
  &:last-child {
    border-bottom: none;
  }
`;

const ItemLeft = styled.div`
  width: 30%;
  padding: 0.5rem;
`;
const ItemRight = styled.div`
  padding: 0.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;
const ItemImage = styled.img`
  width: 100%;
  height: 100%;
`;

const Text = styled.div`
  color: #000;
`;

const LevelName = styled(Text)`
  font-size: 0.9rem;
  font-weight: 600;
`;
const CompanyName = styled(Text)`
  font-size: 0.7rem;
  font-weight: 500;
`;

const WorkTime = styled(Text)`
  font-size: 0.65rem;
  font-weight: 500;
`;

const AddressName = styled(WorkTime)``;
