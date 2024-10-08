import { ActivityIndicator } from 'react-native-paper';
import { color } from 'src/common/constants/color';
export type BaseActivityIndicatorProps = {
  color?: string;
};
function BaseActivityIndicator(props: BaseActivityIndicatorProps) {
  return (
    <ActivityIndicator
      color={props.color ?? color.activeOutlineColor}
      style={{ marginTop: '50%' }}
    />
  );
}

export default BaseActivityIndicator;
