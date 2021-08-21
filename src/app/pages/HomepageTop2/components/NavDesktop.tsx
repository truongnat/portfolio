import { animated } from 'react-spring';
import styled from 'styled-components/macro';
import { media } from '../../../../styles/media';
const LINKS: string[] = ['Home', 'Art', 'About', 'Contact'];
export function NavDesktop() {
  return (
    <Wrapper>
      <WrapNavItem>
        {LINKS.map((link: string, index: number) => (
          <NavItem key={index}>{link}</NavItem>
        ))}
      </WrapNavItem>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  margin-top: 5rem;
  display: none;
  ${media.lg`
    display : flex;
		flex-direction : row;
		align-items : center;
		justify-content: center;
  `}
`;
const WrapNavItem = styled(animated.ul)`
  display: flex;
  flex-direction: row;
  padding: 0;
  margin: 0;
  align-items: center;
  justify-content: flex-start;
  list-style-type: none;
  margin-top: 0.5rem;
`;

const NavItem = styled.li`
  cursor: grabbing;
  color: #fff;
  transition: 0.2s ease-in-out all;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 1, 0.3);
  box-shadow: 6px 10px #7b4397;
  padding: 1rem 2rem;
  text-align: center;
  margin: 0 2rem;
  min-width: 7rem;
  border-radius: 0.5rem;
  border-top: 1px solid #7b4397;
  border-left: 1px solid #7b4397;
  position: relative;
  overflow: hidden;
  z-index: 10;
  transition-duration: 0.4s;
  &::after {
    background-color: #fff;
    content: '';
    position: absolute;
    z-index: -1;
  }
  &::after {
    height: 0;
    left: -100%;
    display: block;
    top: 0;
    transform: skew(50deg);
    transition: all 0.8s;
    transition-duration: 0.6s;
    transform-origin: top left;
    width: 0;
    opacity: 0;
  }
  &:hover::after {
    height: 100%;
    width: 200%;
    opacity: 1;
  }
  &:hover {
    color: #000;
  }
  &:active {
    box-shadow: 4px 6px #7b4397;
    transform: translateY(4px);
  }
`;
