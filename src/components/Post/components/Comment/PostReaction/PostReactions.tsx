import { View, StyleSheet } from 'react-native';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { color } from 'src/common/constants/color';

interface PostReactionsProps {
  emotions: {
    id: number;
    name: string;
    icon: string;
    color: string;
    library: string;
    number: number;
  }[];
}
const PostReactions = (props: PostReactionsProps) => {
  const sortedEmotions = props.emotions.sort((a, b) => b.number - a.number);
  const topThreeEmotions = sortedEmotions.slice(0, 3);
  return (
    <View>
      <View style={styles.left}>
        <View style={styles.listIcon}>
          {/* <Text>{`Like: ${props.likes}`}</Text> */}
          {topThreeEmotions.map((emotion, index) => (
            <View key={emotion.id} style={{ right: index === 1 ? 10 : index === 2 ? 10 : 0 }}>
              {emotion.library === 'AntDesign' && (
                <AntdIcon
                  name={emotion.icon}
                  size={18}
                  color={emotion.color}
                  style={styles.likeIcon}
                />
              )}
              {emotion.library === 'FontAwesome6' && (
                <FontAwesomeIcon6
                  name={emotion.icon}
                  size={18}
                  color={emotion.color}
                  style={styles.heartIcon}
                />
              )}
              {emotion.library === 'Ionicons' && (
                <Ionicons
                  name={emotion.icon}
                  size={18}
                  color={emotion.color}
                  style={styles.laughtIcon}
                />
              )}
              {/* <Text>{emotion.name}</Text> */}
              {/* Hiển thị số lượng cảm xúc nếu cần */}
              {/* <Text>{emotion.number}</Text> */}
            </View>
          ))}
        </View>
        <View>
          <AntdIcon name='right' size={18} color={color.iconButtonColor} style={styles.rightIcon} />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  left: {
    display: 'flex',
    flexDirection: 'row'
    // gap:0
  },
  listIcon: {
    display: 'flex',
    flexDirection: 'row'
  },
  likeIcon: {
    zIndex: 2
  },
  heartIcon: {
    position: 'relative',
    zIndex: 1,
    right: 5
  },
  laughtIcon: {
    position: 'relative',
    right: 10
  },
  rightIcon: {}
});
export default PostReactions;
