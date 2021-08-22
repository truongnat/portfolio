import * as React from 'react';

import { createRenderer } from 'react-test-renderer/shallow';

import { Title } from '../Title';

const shallowRenderer = createRenderer();

describe('<Title />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<Title />);
    const renderOutput = shallowRenderer.getRenderOutput();
    expect(renderOutput).toMatchSnapshot();
  });
});
