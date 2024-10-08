import { RadioButton, RadioButtonGroupProps, Text } from 'react-native-paper';
import { useController, UseControllerProps } from 'react-hook-form';

import BaseRadioButton from 'src/components/BaseRadioButton';
import { Gender } from 'src/common/enum/commom';
import { color } from 'src/common/constants/color';

function GenderRadioGroup(
  props: Omit<RadioButtonGroupProps & UseControllerProps, 'children' | 'onValueChange' | 'value'>
) {
  const { name, rules, control, defaultValue } = props;
  const { field, fieldState } = useController({ name, rules, control, defaultValue });
  return (
    <>
      <RadioButton.Group value={field.value} onValueChange={field.onChange}>
        <BaseRadioButton label='Nam' value={Gender.male} />
        <BaseRadioButton label='Nữ' value={Gender.female} />
        <BaseRadioButton
          label='Tùy chọn khác'
          value={Gender.other}
          subLabel='Chọn tùy chọn khác nếu bạn thuôc giới tính khác hoặc không muốn tiết lộ'
        />
      </RadioButton.Group>
      {fieldState.invalid && (
        <Text variant='bodyLarge' style={{ color: color.error, marginTop: 20 }}>
          {fieldState.error?.message}
        </Text>
      )}
    </>
  );
}

export default GenderRadioGroup;
