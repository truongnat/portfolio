import * as React from 'react';
import styled from 'styled-components/macro';
import { Logo } from './Logo';
import { StyleConstants } from 'styles/StyleConstants';
import { PageWrapper } from '../PageWrapper';
import { MenuDesktop } from './MenuDesktop';
import { MenuMobile } from './MenuMobile';

export function NavBar() {
  return (
    <Wrapper>
      <PageWrapper>
        <Logo />
        <MenuMobile />
        <MenuDesktop />
      </PageWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  box-shadow: 0 1px 0 0 ${p => p.theme.borderLight};
  height: ${StyleConstants.NAV_BAR_HEIGHT};
  display: flex;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2;
`;
