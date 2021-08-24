import * as React from 'react';
import UseAnimations from 'react-useanimations';
import styled from 'styled-components';
import menu3 from 'react-useanimations/lib/menu3';
import { media } from '../../../styles/media';
import { ILink, LINKS } from '../../../constants/route';
import { useHistory } from 'react-router-dom';
import { animated, useSpring } from 'react-spring';
import { ButtonShape } from '../ButtonShape';
import { useMedia } from 'react-use';

export function MenuMobile() {
  const history = useHistory();
  const isxLg = useMedia('(min-width: 992px)');
  const [checked, setChecked] = React.useState<boolean>(false);
  const _handleRouter = (path: string) => {
    history.push(path);
  };
  const props = useSpring({
    left: checked ? '0%' : '100%',
  });

  React.useEffect(() => {
    if (isxLg) {
      setChecked(false);
    }
  }, [isxLg]);
  return (
    <React.Fragment>
      <WrapperMenu
        reverse={checked}
        onClick={() => {
          setChecked(!checked);
        }}
        size={40}
        strokeColor="#fff"
        animation={menu3}
        speed={2.5}
      />
      <MenuFullScreen style={props}>
        <WrapNavItem>
          {LINKS.map((link: ILink, index: number) => (
            <ButtonShape
              title={link.name}
              key={index}
              click={() => _handleRouter(link.path)}
              customStyle={{ marginTop: '2rem' }}
            />
          ))}
        </WrapNavItem>
      </MenuFullScreen>
    </React.Fragment>
  );
}

const WrapperMenu = styled(UseAnimations)`
  z-index: 30;
  ${media.xLg`
	display : none;
`}
`;

const MenuFullScreen = styled(animated.div)`
  display: flex;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 100%;
  right: 0;
  width: 100%;
  height: 100vh;
  z-index: 20;
  background-color: #0e0a0a;
  transition: 0.1s linear all;
  overflow: hidden;
  margin: 0;
`;
const WrapNavItem = styled(animated.ul)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;
