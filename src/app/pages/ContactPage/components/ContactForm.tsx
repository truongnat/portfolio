import * as React from 'react';
import styled from 'styled-components/macro';
import { media } from '../../../../styles/media';
import { ButtonShape } from '../../../components/ButtonShape';
import { animated, useSpring } from 'react-spring';
const INIT_FORM = {
  name: '',
  email: '',
  phone: '',
};

interface IFields {
  name: string;
  email: string;
  phone: string;
}

export function ContactForm() {
  const [fields, setFields] = React.useState<Partial<IFields>>(INIT_FORM);

  const _handleSetValFields = ({
    target: { value, name },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      [name]: value,
    });
  };
  const propsLef = useSpring({
    from: {
      x: -200,
    },
    to: {
      x: 0,
    },
  });

  const propsRight = useSpring({
    from: {
      x: 200,
    },
    to: {
      x: 0,
    },
  });

  return (
    <React.Fragment>
      <MailFormContainer>
        <Title style={propsLef}>Contact Page</Title>
        <Container>
          <WrapperInputFields style={propsLef}>
            <InputFields
              placeholder="Name"
              type="text"
              value={fields.name}
              name="name"
              onChange={_handleSetValFields}
            />
            <FocusBorder />
          </WrapperInputFields>
          <WrapperInputFields style={propsRight}>
            <InputFields
              placeholder="Email"
              type="text"
              value={fields.email}
              name="email"
              onChange={_handleSetValFields}
            />
            <FocusBorder />
          </WrapperInputFields>
          <WrapperInputFields style={propsLef}>
            <InputFields
              placeholder="Phone"
              type="number"
              value={fields.phone}
              name="phone"
              onChange={_handleSetValFields}
            />
            <FocusBorder />
          </WrapperInputFields>
          <WrapperButton style={propsRight}>
            <ButtonShape
              title="Send"
              customStyle={{ margin: '1.5rem 0', padding: '0.35rem' }}
            />
          </WrapperButton>
        </Container>
      </MailFormContainer>
    </React.Fragment>
  );
}

const MailFormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  padding: 0 2rem;
`;

const Container = styled.div`
  ${media.small`
		width : 100%;
		height: 10rem;
	`};
  ${media.xSmall`
    max-width : 25rem
  `}
`;

const WrapperInputFields = styled(animated.div)`
  width: 100%;
  position: relative;
  margin-top: 1.25rem;
  &:first-child {
    margin-top: 0;
  }
`;

const InputFields = styled.input`
  width: 100%;
  font-size: 1rem;
  box-sizing: border-box;
  border: 0;
  padding: 0.438rem 0;
  border-bottom: 1px solid #ccc;
  background-color: transparent;
  color: #fff;
  &:focus {
    outline: none;
  }
`;

const FocusBorder = styled.span`
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

const WrapperButton = styled(animated.div)`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export const Title = styled(animated.h1)`
  color: #7b4397;
  font-size: 1.75rem;
  margin: 2rem 0;
`;
