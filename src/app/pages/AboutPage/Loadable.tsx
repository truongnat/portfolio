import * as React from 'react';
import { lazyLoad } from '../../../utils/loadable';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { LoadingWrapper } from '../../components/LoadingWrapper';

export const AboutPage = lazyLoad(
  () => import('./index'),
  module => module.AboutPage,
  {
    fallback: (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    ),
  },
);
