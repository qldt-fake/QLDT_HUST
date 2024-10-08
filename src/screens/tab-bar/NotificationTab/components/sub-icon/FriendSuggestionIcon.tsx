import { IconButton } from 'react-native-paper';
import { color } from 'src/common/constants/color';

function FriendSuggestionIcon() {
  return (
    <IconButton
      icon='account'
      iconColor={color.white}
      containerColor={color.primary}
      size={14}
      style={{ position: 'absolute', left: 20, top: 20, height: 18, width: 18 }}
    />
  );
}

export default FriendSuggestionIcon;
