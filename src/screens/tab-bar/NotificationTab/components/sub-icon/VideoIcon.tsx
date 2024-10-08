import { IconButton } from 'react-native-paper';
import { color } from 'src/common/constants/color';

function VideoIcon() {
  return (
    <IconButton
      icon='play-circle'
      iconColor={color.white}
      containerColor={color.error}
      size={12}
      style={{ position: 'absolute', left: 20, top: 20, height: 18, width: 18 }}
    />
  );
}

export default VideoIcon;
