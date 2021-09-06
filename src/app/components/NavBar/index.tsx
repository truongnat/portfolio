import * as React from 'react';
import styled from 'styled-components/macro';
import { Logo } from './Logo';
import { StyleConstants } from 'styles/StyleConstants';
import { PageWrapper } from '../PageWrapper';
import { MenuDesktop } from './MenuDesktop';
import { MenuMobile } from './MenuMobile';
import { useWindowScroll } from 'react-use';

interface INavbar {
  menuMobile?: boolean;
  menuDesktop?: boolean;
}

export function NavBar({ menuMobile = true, menuDesktop = true }: INavbar) {
  const { y } = useWindowScroll();
  return (
    <Wrapper display={y <= 30 ? 'flex' : 'none'}>
      <PageWrapper>
        <Logo />
        {menuMobile ? <MenuMobile /> : null}
        {menuDesktop ? <MenuDesktop /> : null}
      </PageWrapper>
    </Wrapper>
  );
}

interface IHeader {
  display?: 'flex' | 'block' | 'none';
}

const Wrapper = styled.header<IHeader>`
  box-shadow: 0 1px 0 0 ${p => p.theme.borderLight};
  height: ${StyleConstants.NAV_BAR_HEIGHT};
  display: ${p => p.display || 'flex'};
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2;
`;
