import { View } from 'react-native';
import { Text } from 'react-native-paper';
export type HeaderItemCommentProps = { onPress?: () => any };
function HeaderItemComment(props: HeaderItemCommentProps) {
  const { onPress } = props;
  return (
    <>
      <View style={{ padding: 10 }}>
        <Text
          onPress={onPress ?? (() => {})}
          variant='titleMedium'
          style={{ fontSize: 14, fontWeight: '700', marginBottom: 4 }}
        >
          Xem các bình luận trước ...
        </Text>
      </View>
    </>
  );
}

export default HeaderItemComment;
