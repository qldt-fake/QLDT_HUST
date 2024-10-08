import { useController, UseControllerProps } from 'react-hook-form';
import { Switch, SwitchProps } from 'react-native-paper';

import { color } from 'src/common/constants/color';

export type BaseSwitchButton = Partial<SwitchProps> & UseControllerProps;
function BaseSwitchButton(props: BaseSwitchButton) {
  const { name, rules, control, defaultValue } = props;
  const { field } = useController({
    name,
    rules,
    control,
    defaultValue: defaultValue ?? false
  });
  return (
    <Switch
      value={field.value}
      onValueChange={field.onChange}
      color={color.primary}
      style={{ padding: 10 }}
    />
  );
}

export default BaseSwitchButton;
