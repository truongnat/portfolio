import * as React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ILink, LINKS } from '../../../constants/route';
import { media } from '../../../styles/media';
import { ButtonShape } from '../ButtonShape';

export function MenuDesktop() {
  const history = useHistory();
  const _handleRouter = (path: string) => {
    history.push(path);
  };
  return (
    <WrapperMenu>
      {LINKS.map((link: ILink, index: number) => (
        <ButtonShape
          key={index}
          title={link.name}
          click={() => _handleRouter(link.path)}
        />
      ))}
    </WrapperMenu>
  );
}

const WrapperMenu = styled.div`
  display: none;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  list-style-type: none;
  ${media.xLg`
    display : flex;
  `}
`;
