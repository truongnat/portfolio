import styled, { keyframes } from 'styled-components/macro';
import { media } from '../../../../styles/media';

const speed = 1.5;

const scale = keyframes`
   0% {
        transform: scale(1);
    }
    100% {
        transform: scale(1.02);
    }
`;

export const SubTitle = styled.span`
  font-size: 1rem;
  color: #fff;
  letter-spacing: 2rem;
  animation: ${scale} ${speed * 1.25}s ease-in-out infinite alternate;
  transform-origin: center;
  font-weight: 600;
  ${media.small`
	  font-size : 0.75rem;
      letter-spacing:  0.2rem;
  `};
  ${media.xSmall`
		font-size: 1rem;
		letter-spacing: 0.5rem;
    `};
  ${media.medium`
        font-size : 1rem;
        letter-spacing:  0.5rem;
    `}
`;
