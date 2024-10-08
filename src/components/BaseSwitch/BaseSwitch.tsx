import { useController, UseControllerProps } from 'react-hook-form';
import { Card, CardTitleProps, Divider, Switch, SwitchProps, Text } from 'react-native-paper';

import { color } from 'src/common/constants/color';

export type BaseSwitchProps = Partial<SwitchProps> &
  UseControllerProps &
  CardTitleProps & { isDivider?: boolean };

function BaseSwitch(props: BaseSwitchProps) {
  const { name, rules, control, defaultValue, title, left, subtitle, isDivider } = props;
  const { field, fieldState } = useController({
    name,
    rules,
    control,
    defaultValue: defaultValue ?? false
  });

  return (
    <>
      <Card.Title
        title={title}
        subtitle={subtitle}
        titleVariant='titleMedium'
        subtitleVariant='bodySmall'
        subtitleStyle={{ color: color.activeOutlineColor }}
        left={left}
        titleNumberOfLines={3}
        subtitleNumberOfLines={3}
        right={() => (
          <Switch
            value={field.value}
            onValueChange={field.onChange}
            color={color.primary}
            style={{ padding: 10 }}
          />
        )}
      />

      {fieldState.invalid && (
        <Text variant='bodyLarge' style={{ color: color.error, marginTop: 20 }}>
          {fieldState.error?.message}
        </Text>
      )}
      {isDivider ? <Divider /> : null}
    </>
  );
}

export default BaseSwitch;
