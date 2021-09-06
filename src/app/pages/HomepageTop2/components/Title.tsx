import styled, { keyframes } from 'styled-components/macro';
import { speed } from '../../../../constants/common';
import { media } from '../../../../styles/media';

const scale = keyframes`
   0% {
        transform: scale(1);
    }
    100% {
        transform: scale(1.02);
    }
`;
export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 2rem;
  margin: 0;
  padding: 1rem 0;
  color: #fff;
  animation: ${scale} ${speed * 1.25}s ease-in-out infinite alternate;
  transform-origin: center;
  text-transform: uppercase;
  ${media.small`
		font-size : 1.25rem;
		letter-spacing: 0.5rem;
  `};
  ${media.xSmall`
		font-size: 1.5rem;
		letter-spacing: 0.75rem;
	`};
  ${media.medium`
        font-size : 2rem;
        letter-spacing: 1rem;
    `}
`;
