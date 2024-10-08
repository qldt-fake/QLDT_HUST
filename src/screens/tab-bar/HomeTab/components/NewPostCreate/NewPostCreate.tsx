import { TouchableOpacity, View } from 'react-native';
import { Avatar, IconButton, Text } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import styles from './styles';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import {
  AppNaviagtionName,
  PostNavigationName,
  ProfileNavigationName
} from 'src/common/constants/nameScreen';
import { useAppSelector } from 'src/redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { getAvatarUri } from 'src/utils/helper';

function NewPostCreate() {
  const auth = useAppSelector(selectAuth);
  const avatar = auth.user?.avatar;
  const navigation: NavigationProp<AppNavigationType, AppNaviagtionName.ProfileNavigation> =
    useNavigation();
  const navigation2: NavigationProp<AppNavigationType, AppNaviagtionName.PostNavigation> =
    useNavigation();
  const navigaProfileScreen = () =>
    navigation.navigate(AppNaviagtionName.ProfileNavigation, {
      screen: ProfileNavigationName.Profile,
      params: { user_id: auth.user?.id as string }
    });
  const handleNavigateCreatePost = () =>
    navigation2.navigate(AppNaviagtionName.PostNavigation, {
      screen: PostNavigationName.CreatePostScreen
    });
  return (
    <View style={styles.wrapperCreatePost}>
      <TouchableOpacity activeOpacity={0.8} onPress={navigaProfileScreen}>
        <Avatar.Image source={getAvatarUri(avatar as string)} size={40} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.createPostButton}
        activeOpacity={0.6}
        onPress={handleNavigateCreatePost}
      >
        <Text style={{ paddingLeft: 10 }}>Bạn đang nghĩ gì?</Text>
      </TouchableOpacity>
      <IconButton icon='file-image' iconColor={color.green} size={25} />
    </View>
  );
}

export default NewPostCreate;
