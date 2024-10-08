import { IconButton } from 'react-native-paper';
import { color } from 'src/common/constants/color';

function BirthdayIcon() {
  return (
    <IconButton
      icon='cake'
      iconColor={color.white}
      containerColor={color.primary}
      size={12}
      style={{ position: 'absolute', left: 20, top: 20, height: 18, width: 18 }}
    />
  );
}

export default BirthdayIcon;
