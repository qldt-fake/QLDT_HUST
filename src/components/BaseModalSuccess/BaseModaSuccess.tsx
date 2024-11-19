import Modal, { ModalProps } from 'react-native-modal';
import { Button, Text, IconButton } from 'react-native-paper';
import { View } from 'react-native';
import { color } from 'src/common/constants/color';
import { NavigationProp, useNavigation } from '@react-navigation/native';
export type BaseModalErrorProps = Partial<Omit<ModalProps, 'children'>> & {
  title: string, onOkPress?: () => void;
};
function BaseModalSuccess(props: BaseModalErrorProps) {
  const { isVisible, onBackdropPress, title,onOkPress, ...remainProps } = props;
  const naviagion: NavigationProp<AuthNavigationType, 'VerifyOTPScreen'> = useNavigation();
 
  return (
    <Modal
      {...remainProps}
      isVisible={isVisible}
      animationIn='zoomIn'
      animationOut='zoomOut'
      backdropOpacity={0.5}
      animationInTiming={800}
      animationOutTiming={800}
      // onBackdropPress={onBackdropPress}
      style={{ justifyContent: 'center', margin: 0 }}
    >
      <View
        style={{
          backgroundColor: color.white,
          paddingHorizontal: 20,
          paddingVertical: 40,
          marginHorizontal: 30,
          borderRadius: 4,
          alignItems: 'center',

        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text
            variant='bodyLarge'
            style={{
              color: color.activeOutlineColor,
              fontSize: 18,
              fontWeight: '300',
              textAlign: 'center',
              paddingBottom: 20
            }}
          >
            {title}
          </Text>
          <IconButton
            icon="check-circle"
            size={24}
            iconColor={color.successPrimary}
            style={{ marginTop: -10 }}
          />
        </View>
        <Button onPress={onOkPress} mode='outlined' theme={{ colors: { primary: color.successPrimary, outline: color.successPrimary } }}
          style={{
            width: 100,
            justifyContent: 'center',
          }}
        >OK</Button>
      </View>
    </Modal>
  );
}

export default BaseModalSuccess;
