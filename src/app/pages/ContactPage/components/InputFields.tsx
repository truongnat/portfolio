import styled from 'styled-components/macro';

interface IInputFields {
  error?: boolean;
}

export const InputFields = styled.input<IInputFields>`
  width: 100%;
  font-size: 1rem;
  box-sizing: border-box;
  border: 0;
  padding: 0.438rem 0;
  border-bottom: 1px solid;
  border-bottom-color: ${p => (p.error ? '#ff4d4d' : '#ccc')};
  background-color: transparent;
  color: #fff;
  &:focus {
    outline: none;
  }
`;

export const FocusBorder = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #7b4397;
  transition: 0.4s;
  ${InputFields}:focus ~ & {
    width: 100%;
    transition: 0.4s;
  } ;
`;
