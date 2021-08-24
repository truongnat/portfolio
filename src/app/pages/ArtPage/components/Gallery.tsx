import { useMemo, useState } from 'react';
import { useTransition, a } from 'react-spring';
import useMeasure from 'react-use-measure';
import styled from 'styled-components/macro';
import useMedia from '../../../../hooks/useMedia';
import mockData from '../mockData';

export function Gallery() {
  const columns = useMedia(
    ['(min-width: 1024px)', '(min-width: 768px)', '(min-width: 600px)'],
    [5, 4, 3],
    2,
  );

  const [ref, { width }] = useMeasure();

  const [items] = useState(mockData);

  const [heights, gridItems] = useMemo(() => {
    let heights = new Array(columns).fill(0);
    let gridItems = items.map((child, i) => {
      const column = heights.indexOf(Math.min(...heights));
      const x = (width / columns) * column;
      const y = (heights[column] += child.height / 2) - child.height / 2;

      return {
        ...child,
        x,
        y,
        width: width / columns,
        height: child.height / 2,
      };
    });
    return [heights, gridItems];
  }, [columns, items, width]);
  const transitions = useTransition(gridItems, {
    key: (item: { css: string; height: number }) => item.css,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  return (
    <List ref={ref} style={{ height: Math.max(...heights) }}>
      {transitions((style, item) => (
        <a.div style={style}>
          <div
            style={{
              backgroundImage: `url(${item.css}?auto=compress&dpr=2&h=500&w=500)`,
            }}
          />
        </a.div>
      ))}
    </List>
  );
}

const List = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  & > div {
    position: absolute;
    will-change: transform, width, height, opacity;
    padding: 15px;
  }
  & > div > div {
    position: relative;
    background-size: cover;
    background-position: center center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-transform: uppercase;
    font-size: 10px;
    line-height: 10px;
    border-radius: 4px;
    box-shadow: 0px 10px 50px -10px rgba(0, 0, 0, 0.2);
  }
`;
