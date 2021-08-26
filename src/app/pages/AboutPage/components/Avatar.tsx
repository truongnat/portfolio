import * as React from 'react';
import { animated, useSpring } from 'react-spring';
import styled from 'styled-components/macro';
import Me from '../assets/me.png';
// import My from '../assets/My.png';
export function Avatar() {
  const [flipped, set] = React.useState<boolean>(false);

  const { transform } = useSpring({
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  return (
    <WrapperAvatar onClick={() => set(state => !state)}>
      {/* <Image src={flipped ? My : Me} alt="Me" style={{ transform }} /> */}
      <Image src={Me} alt="Me" style={{ transform }} />
    </WrapperAvatar>
  );
}

const WrapperAvatar = styled.div`
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  border: 0.25rem;
  border-style: solid;
  border-color: #7b4397;
  overflow: hidden;
  margin-top: -4rem;
  margin-left: 2rem;
`;

const Image = styled(animated.img)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  will-change: transform;
`;
