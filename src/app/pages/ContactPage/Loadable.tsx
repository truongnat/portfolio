import * as React from 'react';
import styled from 'styled-components/macro';
import { lazyLoad } from '../../../utils/loadable';
import { LoadingIndicator } from '../../components/LoadingIndicator';
const LoadingWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const ContactPage = lazyLoad(
  () => import('./index'),
  module => module.ContactPage,
  {
    fallback: (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    ),
  },
);
