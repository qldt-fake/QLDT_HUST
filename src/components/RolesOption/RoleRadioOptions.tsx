import { RadioButton, RadioButtonGroupProps, Text } from 'react-native-paper';
import { useController, UseControllerProps } from 'react-hook-form';

import BaseRadioButton from 'src/components/BaseRadioButton';
import { color } from 'src/common/constants/color';
import { Roles } from 'src/common/enum/commom';
import BaseTextTitle from '../BaseTextTitle';
function RoleRadioOptinons(
  props: Omit<RadioButtonGroupProps & UseControllerProps, 'children' | 'onValueChange' | 'value'>
) {
  const { name, rules, control, defaultValue } = props;
  const { field, fieldState } = useController({ name, rules, control, defaultValue });
  return (
    <>
      <RadioButton.Group value={field.value} onValueChange={field.onChange}>
        <BaseTextTitle> Chọn đối tượng </BaseTextTitle>
        <BaseRadioButton label='Giảng viên' value={Roles.LECTURER} />
        <BaseRadioButton label='Sinh viên' value={Roles.STUDENT} />
      </RadioButton.Group>
      {fieldState.invalid && (
        <Text variant='bodyLarge' style={{ color: color.error, marginTop: 20 }}>
          {fieldState.error?.message}
        </Text>
      )}
    </>
  );
}

export default RoleRadioOptinons;
