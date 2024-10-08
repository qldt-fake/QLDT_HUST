import { TouchableHighlight, View, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import { getAvatarUri } from 'src/utils/helper';
export type CommentItemProps = {
  listComments: {
    id: number;
    author: string;
    content: string;
    avatarUrl: string;
    timePost: string;
  };
};
function CommentItem(props: CommentItemProps) {
  const { listComments } = props;
  return (
    <>
      <View>
        <View style={styles.CommentItem}>
          <View style={styles.top}>
            <TouchableHighlight
              // activeOpacity={0.8}
              // underlayColor={color.borderColor}
              onPress={() => {}}
              style={styles.touchableHighlight}
              underlayColor={color.Comment}
            >
              <View>
                <Avatar.Image
                  source={getAvatarUri(listComments.avatarUrl)}
                  size={40}
                  style={styles.avatarImage}
                />
              </View>
            </TouchableHighlight>
            <View style={styles.Content}>
              <Text style={styles.TextName}>{listComments.author}</Text>
              <Text style={styles.TextConmment}>{listComments.content}</Text>
            </View>
          </View>
          <View style={styles.Function}>
            <Text style={styles.TextTime}>{listComments.timePost}</Text>
            <TouchableHighlight
              onPress={() => {}}
              style={styles.highlightText}
              underlayColor={color.Comment}
            >
              <Text style={styles.TextLike}> Thích</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {}}
              style={styles.highlightConment}
              underlayColor={color.Comment}
            >
              <Text style={styles.TextResponse}> Phản hồi</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
      {/* <Card.Title
        {...remainProps}
        title={title}
        left={() => (
          <Avatar.Image
            source={getAvatarUri(avatar as string)}
            size={40}
            style={{ opacity: 0.8 }}
          />
        )}
        right={() => (
          <TouchableOpacity activeOpacity={0.9} onPress={onPressNonBlock ?? (() => { })}>
            <Text
              style={{
                paddingHorizontal: 20,
                fontWeight: '600',
                fontSize: 16,
                color: color.activeOutlineColor
              }}
            >
              Bỏ chặn
            </Text>
          </TouchableOpacity>
        )}
      /> */}
    </>
  );
}
const styles = StyleSheet.create({
  touchableHighlight: {
    borderRadius: 50, // Đảm bảo các góc của TouchableHighlight phù hợp với hình ảnh
    overflow: 'hidden', // Để các phần không phù hợp với hình ảnh bị ẩn đi
    // width: 40,
    height: 40,
    // marginTop:8,
    marginLeft: 8
    // zIndex:10
  },

  avatarImage: {
    opacity: 0.8
  },

  CommentItem: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 14,
    gap: 6
  },
  top: {
    flexDirection: 'row',
    gap: 10
  },
  Content: {
    flexDirection: 'column',
    backgroundColor: color.Comment,
    borderRadius: 10,
    paddingRight: 20,
    paddingBottom: 10,
    maxWidth: 290
  },
  TextName: {
    marginTop: 8,
    marginLeft: 12,
    height: 21,
    color: color.black,
    paddingRight: 2,
    paddingLeft: 2,
    fontWeight: 'bold'
  },
  TextConmment: {
    marginLeft: 12,
    lineHeight: 20
    // maxHeight:340
  },
  TextTime: {},
  TextLike: {
    color: color.textLike,
    fontWeight: '700'
  },

  highlightText: {
    height: 20,
    width: 45,
    borderRadius: 4
  },
  highlightConment: {
    height: 20,
    width: 65,
    borderRadius: 4
  },
  TextResponse: {
    color: color.textLike,
    fontWeight: '700'
  },
  Function: {
    flexDirection: 'row',
    marginLeft: 68,
    gap: 20
  }
});
export default CommentItem;
