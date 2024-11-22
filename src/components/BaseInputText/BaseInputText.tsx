import { TextInput, TextInputProps } from 'react-native-paper';
import { View } from 'react-native';
import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components/native';
import { color } from 'src/common/constants/color';
import { useController, UseControllerProps } from 'react-hook-form';

interface InputTextProps {
  hideLabel?: boolean;
  required?: boolean;
}

export interface LableProps {
  error: boolean;
}

const defaultProps: Omit<BaseInputProps, 'name'> = {
  hideLabel: false,
  required: false,
  activeOutlineColor: color.activeOutlineColor,
  outlineColor: color.outlineColor,
  selectionColor: color.outlineColor
};

export type BaseInputProps = InputTextProps & TextInputProps & UseControllerProps;

function BaseInputText(props: BaseInputProps): JSX.Element {
  const { name, rules, defaultValue, label, required, hideLabel, control, ...inputProps } = props;
  const { field, fieldState } = useController({
    name,
    rules,
    control,
    defaultValue
  });

  return (
    <View>
      {hideLabel && label && (
        <Label error={fieldState.invalid}>
          {label}
          {required && hideLabel && <RequiredIcon> *</RequiredIcon>}
        </Label>
      )}
      <StyledTextInput
        {...inputProps}
        {...field}
        label={!props.hideLabel ? label : ''}
        onChangeText={field.onChange}
        error={fieldState.invalid}
      />
      {fieldState.invalid && <TextError>{fieldState.error?.message}</TextError>}
    </View>
  );
}

BaseInputText.defaultProps = defaultProps;
const StyledTextInput = styled(TextInput)`
  color: #ffffff;
  height: 54px;
  margin-bottom: 8px;
`;
const TextError = styled.Text`
  color: ${color.error};
  padding-top: 4px;
  font-size: 14px;
  padding-left: 8px;
`;
const Label: FC<PropsWithChildren<LableProps>> = styled.Text`
  color: ${props => (props.error ? color.error : `white`)};
  padding: 8px 12px;
  font-size: 14px;
  padding-left: 12px;
  font-weight: 500;
`;
const RequiredIcon = styled.Text`
  color: ${color.error};
  padding-left: 4px;
`;

export default BaseInputText;
