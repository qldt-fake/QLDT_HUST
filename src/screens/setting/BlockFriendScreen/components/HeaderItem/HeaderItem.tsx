import { TouchableOpacity, View } from 'react-native';
import { Divider, IconButton, Text } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import globalStyles from 'src/common/styles/globalStyles';
export type HeaderItemProps = { onPressAddItem?: () => any };
function HeaderItem(props: HeaderItemProps) {
  const { onPressAddItem } = props;
  return (
    <>
      <View style={{ padding: 10 }}>
        <Text variant='titleMedium' style={{ fontSize: 18, fontWeight: '700', marginBottom: 4 }}>
          Người bị chặn
        </Text>
        <Text variant='bodySmall' style={{ color: color.activeOutlineColor }}>
          Một khi bạn đã chặn ai đó, họ sẽ không xem được nội dung bạn tự đăng trên dòng thời gian
          của minh, gắn thẻ bạn, mời bạn tham gia sự kiện hoặc nhóm, bắt đầu cuộc trò chuyện với bạn
          hay thêm bạn làm bạn bè. Điều này không bao gồm các ứng dụng trò chơi hay nhóm mà cả bạn
          và người này cùng tham gia
        </Text>
      </View>
      <Divider />
      <TouchableOpacity
        activeOpacity={0.7}
        style={[globalStyles.flexRow, globalStyles.centerAlignItem]}
        onPress={onPressAddItem ?? (() => {})}
      >
        <IconButton icon='plus-box' size={30} iconColor={color.primary} />
        <Text
          style={{
            color: color.primary,
            marginLeft: 2,
            fontSize: 14,
            fontWeight: '700',
            textTransform: 'uppercase'
          }}
        >
          Thêm vào danh sách chặn
        </Text>
      </TouchableOpacity>
      <Divider />
    </>
  );
}

export default HeaderItem;
