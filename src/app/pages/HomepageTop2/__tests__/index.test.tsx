import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';

import { HomePageTop2 } from '..';

const shallowRenderer = createRenderer();

describe('<HomePageTop2 />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<HomePageTop2 />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
