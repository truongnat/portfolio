import * as React from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { media } from '../../../../styles/media';
import { useSpring, animated } from 'react-spring';
import { ILink, LINKS } from '../../../../constants/route';
import { useHistory } from 'react-router-dom';
import { ButtonShape } from '../../../components/ButtonShape';

export function NavMobile() {
  const history = useHistory();
  const [toggleMenu, setToggleMenu] = React.useState<boolean>(false);

  const props = useSpring({
    opacity: toggleMenu ? 1 : 0,
    transform: toggleMenu ? `rotateX(0deg)` : `rotateX(90deg)`,
    transformOrigin: toggleMenu ? 'top left' : 'top left',
  });

  const _handleRouter = (path: string) => {
    setToggleMenu(false);
    history.push(path);
  };

  return (
    <Wrapper>
      <WrapIcon onClick={() => setToggleMenu(!toggleMenu)}>
        {toggleMenu ? (
          <Svg viewBox="0 0 40 40">
            <Path d="M 10,10 L 30,30 M 30,10 L 10,30" />
          </Svg>
        ) : (
          <SvgDoubleDown viewBox="0 0 24 24">
            <Path d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
          </SvgDoubleDown>
        )}
      </WrapIcon>
      <WrapNavItem style={props}>
        {LINKS.map((link: ILink, index: number) => (
          <ButtonShape
            key={index}
            title={link.name}
            click={() => _handleRouter(link.path)}
            customStyle={{ marginTop: '1.5rem' }}
          />
        ))}
      </WrapNavItem>
    </Wrapper>
  );
}

interface SvgProps {}
const speed = 1.5;

const rotate = keyframes`
  from {
    transform: translateY(0px);
  }

  to {
    transform: translateY(3px);
  }
`;

const Wrapper = styled.div`
  width: 100%;
  margin-top: 5rem;
  ${media.small`
			display : flex;
			flex-direction : column;
			align-items : center;
			justify-content: flex-start
  `};
  ${media.lg`
    display : none
  `}
`;

const WrapIcon = styled.div`
  background-color: teal;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: 0.2s ease-in-out all;
  padding: 0.25rem;
  z-index: 10;
  &:hover {
    background-color: #13b3b3;
  }
`;

const Svg = styled.svg<SvgProps>`
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SvgDoubleDown = styled(Svg)`
  padding: 0.25rem;
  animation: ${rotate} ${speed * 1.25}s ease-in-out infinite alternate;
`;

const Path = styled.path`
  stroke: #fff;
  fill: transparent;
  stroke-linecap: round;
  stroke-width: 1;
  stroke-linejoin: round;
`;

const WrapNavItem = styled(animated.ul)`
  list-style-type: none;
  padding: 0;
  margin: 0;
  border-radius: 0.5rem;
  z-index: 10;
  ${media.lg`
    display : none
  `}
`;
