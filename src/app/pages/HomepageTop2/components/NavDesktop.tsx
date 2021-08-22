import { useHistory } from 'react-router-dom';
import { animated } from 'react-spring';
import styled from 'styled-components/macro';
import { ILink, LINKS } from '../../../../constants/route';
import { media } from '../../../../styles/media';
import { ButtonShape } from '../../../components/ButtonShape';
export function NavDesktop() {
  const history = useHistory();
  const _handleRouter = (path: string) => {
    history.push(path);
  };
  return (
    <Wrapper>
      <WrapNavItem>
        {LINKS.map((link: ILink, index: number) => (
          <ButtonShape
            key={index}
            title={link.name}
            click={() => _handleRouter(link.path)}
          />
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
