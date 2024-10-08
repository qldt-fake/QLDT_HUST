import { RadioButton, RadioButtonItemProps } from 'react-native-paper';
import { Text } from 'react-native';
import { color } from 'src/common/constants/color';
export interface OtherRadiobuttonProps {
  subLabel?: string;
}
export type BaseRadioButton = OtherRadiobuttonProps & RadioButtonItemProps;
function BaseRadioButton(props: BaseRadioButton) {
  return (
    <>
      <RadioButton.Item value={props.value} label={props.label} color={color.primary} />
      {props.subLabel && <Text style={{ marginLeft: 16 }}>{props.subLabel}</Text>}
    </>
  );
}

export default BaseRadioButton;
