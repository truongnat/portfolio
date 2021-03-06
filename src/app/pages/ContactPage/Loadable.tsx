import * as React from 'react';
import { lazyLoad } from '../../../utils/loadable';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { LoadingWrapper } from '../../components/LoadingWrapper';

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
