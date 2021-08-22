import * as React from 'react';
import { CSS } from 'react-spring';
import styled from 'styled-components/macro';

export interface IButtonShape {
  click?: () => void;
  title?: string;
  customStyle?: CSS.Properties;
}

export function ButtonShape({ click, title, customStyle }: IButtonShape) {
  return (
    <Button onClick={click} style={customStyle}>
      {title}
    </Button>
  );
}

const Button = styled.div`
  cursor: grabbing;
  color: #fff;
  transition: 0.2s ease-in-out all;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 1, 0.3);
  box-shadow: 6px 10px #7b4397;
  padding: 1rem 2rem;
  text-align: center;
  margin: 0 1.5rem;
  min-width: 8rem;
  border-radius: 0.5rem;
  border-top: 1px solid #7b4397;
  border-left: 1px solid #7b4397;
  position: relative;
  overflow: hidden;
  z-index: 10;
  transition-duration: 0.4s;
  transform: skew(-10deg);
  &::after {
    background-color: #fff;
    content: '';
    position: absolute;
    z-index: -1;
  }
  &::after {
    height: 0;
    left: -100%;
    display: block;
    top: 0;
    transform: skew(50deg);
    transition: all 0.8s;
    transition-duration: 0.6s;
    transform-origin: top left;
    width: 0;
    opacity: 0;
  }
  &:hover::after {
    height: 100%;
    width: 200%;
    opacity: 1;
  }
  &:hover {
    color: #000;
  }
  &:active {
    box-shadow: 4px 6px #7b4397;
    transform: translateY(4px);
  }
`;
