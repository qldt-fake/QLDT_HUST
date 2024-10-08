import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native-paper';
import { color } from 'src/common/constants/color';
export type BaseModalLoadingProps = {
  isVisible: boolean;
};
function BaseModalLoading(props: BaseModalLoadingProps) {
  const { isVisible } = props;
  return (
    <Modal
      isVisible={isVisible}
      animationIn='fadeIn'
      animationOut='fadeOut'
      backdropOpacity={0.5}
      animationInTiming={800}
      animationOutTiming={800}
      style={{ justifyContent: 'center', margin: 0, backgroundColor: color.white }}
    >
      <ActivityIndicator animating={true} color={color.primary} />
    </Modal>
  );
}

export default BaseModalLoading;
