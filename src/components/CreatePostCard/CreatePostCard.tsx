import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from 'src/common/constants/color';
import { AppNaviagtionName, PostNavigationName } from 'src/common/constants/nameScreen';
import { getAvatarUri } from 'src/utils/helper';

export interface CreatePostCardProps {
  avatar: string;
}

const CreatePostCard = (props: CreatePostCardProps) => {
  const navigation2: NavigationProp<AppNavigationType, AppNaviagtionName.PostNavigation> =
    useNavigation();
  const handleNavigateCreatePost = () =>
    navigation2.navigate(AppNaviagtionName.PostNavigation, {
      screen: PostNavigationName.CreatePostScreen
    });
  return (
    <TouchableOpacity style={styles.containerCreatePost} onPress={handleNavigateCreatePost}>
      <TouchableOpacity activeOpacity={0.8}>
        <Image source={getAvatarUri(props.avatar)} style={styles.avatar} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.input} activeOpacity={0.7}>
        <Text style={{ color: color.textColor, fontSize: 16 }}>Bạn đang nghĩ gì?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <Icon name='image-multiple' size={24} color={color.green}></Icon>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerCreatePost: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  input: {
    flex: 1
  },
  iconContainer: {
    marginLeft: 15,
    marginRight: 15
  }
});

export default CreatePostCard;
