import * as React from 'react';
import styled from 'styled-components/macro';
import { media } from '../../../../styles/media';
import { ButtonShape } from '../../../components/ButtonShape';
import { animated, useSpring } from 'react-spring';
import { FocusBorder, InputFields } from './InputFields';
import { RG } from '../../../../constants/rg';
import { useForm } from 'react-hook-form';
interface IFields {
  name: string;
  email: string;
  phone: string;
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFields>();

  const onSubmit = handleSubmit((data: IFields) => {
    console.log('show form', data);
  });

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
        <ContainerForm>
          <WrapperInputFields style={propsLef}>
            <InputFields
              placeholder="Join Will"
              {...register('name', { required: true })}
              error={!!errors?.name}
            />
            <FocusBorder />
          </WrapperInputFields>
          <WrapperInputFields style={propsRight}>
            <InputFields
              placeholder="vtc@gmail.com"
              {...register('email', { required: true, pattern: RG.email })}
              error={!!errors?.email}
            />
            <FocusBorder />
          </WrapperInputFields>
          <WrapperInputFields style={propsLef}>
            <InputFields
              placeholder="0 -> 9"
              type="number"
              {...register('phone', { required: true })}
              error={!!errors?.email}
            />
            <FocusBorder />
          </WrapperInputFields>
          <WrapperButton style={propsRight}>
            <ButtonShape
              title="Send"
              click={onSubmit}
              customStyle={{ margin: '1.5rem 0', padding: '0.5rem' }}
            />
          </WrapperButton>
        </ContainerForm>
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

const ContainerForm = styled.form`
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
