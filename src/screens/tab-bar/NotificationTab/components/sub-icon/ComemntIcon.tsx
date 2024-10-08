import { IconButton } from 'react-native-paper';
import { color } from 'src/common/constants/color';

function CommentIcon() {
  return (
    <IconButton
      icon='comment'
      iconColor={color.white}
      containerColor={color.green}
      size={10}
      style={{ position: 'absolute', left: 20, top: 20, height: 18, width: 18 }}
    />
  );
}

export default CommentIcon;
