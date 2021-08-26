import * as React from 'react';
import styled from 'styled-components/macro';
import { Avatar } from '../components/Avatar';
import BgMe from '../assets/bgMe.png';
import { media } from '../../../../styles/media';
export function AboutHeader() {
  return (
    <WrapperHeader>
      <BgHeader style={{ backgroundImage: `url(${BgMe})` }} />
      <Avatar />
      <WrapperInfo>
        <Name>Truong.Nat</Name>
        <Title>Always work hard and never stop learning!</Title>
        <CompanyName>NTQ Solution JSC</CompanyName>
        <AddressName>Phu Do, Hanoi, Vietnam</AddressName>
      </WrapperInfo>
    </WrapperHeader>
  );
}

const WrapperHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const BgHeader = styled.div`
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 7rem;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  ${media.lg`
  min-height: 10rem;
  `};
  ${media.medium`
  min-height: 12rem;
  `}
`;

const WrapperInfo = styled.div`
  margin: 1rem 2rem 0;
`;

const Name = styled.h1`
  color: #fff;
  font-size: 1.45rem;
  margin: 0.5rem 0;
`;
const Title = styled.div`
  color: #fff;
  font-size: 0.95rem;
  margin: 0.5rem 0;
  font-weight: 500;
`;
const CompanyName = styled.div`
  font-size: 0.8rem;
  color: #fff;
  font-weight: 200;
`;
const AddressName = styled.div`
  font-size: 0.8rem;
  color: #fff;
  font-weight: 200;
`;
