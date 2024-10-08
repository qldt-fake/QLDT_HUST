import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Alert, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal/dist/modal';
import { Text } from 'react-native-paper';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconF5 from 'react-native-vector-icons/FontAwesome5';
import {
  AppNaviagtionName,
  PostNavigationName,
  ReportNavigationName
} from 'src/common/constants/nameScreen';
import { PostProps } from './Post';
import { color } from 'src/common/constants/color';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { deletePostApi } from 'src/services/post.sevices';
import { setMessage } from 'src/redux/slices/appSlice';

export type ReportModalType = {
  isVisible: boolean;
  authorId: string;
  postId: string;
  authorName: string;
  post: PostProps;
  onDeletePost: () => void;
  onBackdropPress: () => any;
};

function ReportModal(props: ReportModalType) {
  const { isVisible, onBackdropPress, authorId, authorName, postId, post, onDeletePost } = props;

  const navigation: NavigationProp<AppNavigationType, AppNaviagtionName.ReportNavigation> =
    useNavigation();
  const navigationEditPost: NavigationProp<AppNavigationType, AppNaviagtionName.PostNavigation> =
    useNavigation();
  const auth = useAppSelector(selectAuth);
  const isOwnPost = auth.user?.id === authorId;
  const dispatch = useAppDispatch();

  const handleNavigation = () => {
    onBackdropPress();
    navigation.navigate(AppNaviagtionName.ReportNavigation, {
      screen: ReportNavigationName.ReportScreen,
      params: { id: postId, username: authorName, userId: authorId }
    });
  };
  const handleNavigationEditPost = () => {
    onBackdropPress();
    navigationEditPost.navigate(AppNaviagtionName.PostNavigation, {
      screen: PostNavigationName.EditPostScreen,
      params: { data: post }
    });
  };
  const handleDeletePost = () => {
    onBackdropPress();
    Alert.alert('XÁC NHẬN', 'Bạn có chắc chắn muốn xóa bài viết này không?', [
      {
        text: 'Hủy',
        onPress: async () => {},
        style: 'cancel'
      },
      {
        text: 'Đồng ý',
        onPress: async () => {
          try {
            const result = await deletePostApi({ id: postId });
            if (result.success) {
              dispatch(setMessage('Xóa bài thành công'));
              onDeletePost();
            }
          } catch (error: any) {
            dispatch(setMessage(error.message));
          }
        }
      }
    ]);
  };
  return (
    <Modal
      isVisible={isVisible}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      animationInTiming={500}
      animationOutTiming={500}
      backdropOpacity={0.8}
      onBackdropPress={onBackdropPress}
      style={{ justifyContent: 'flex-end', margin: 0 }}
    >
      <View
        style={{
          backgroundColor: color.white,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          padding: 20,
          gap: 20
        }}
      >
        {!isOwnPost && (
          <>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ minWidth: 30, flexDirection: 'row', justifyContent: 'center' }}>
                <IconF name='bookmark' size={30} color={color.textColor} />
              </View>
              <View style={{}}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: color.textColor }}>
                  Lưu bài viết{' '}
                </Text>
                <Text style={{ fontSize: 14 }}>Thêm vào danh sách các mục đã lưu</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
              onPress={handleNavigation}
            >
              <View style={{ minWidth: 30, flexDirection: 'row', justifyContent: 'center' }}>
                <IconF name='exclamation-circle' size={30} color={color.textColor} />
              </View>
              <View style={{ marginRight: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: color.textColor }}>
                  Báo cáo bài viết này
                </Text>
                <Text style={{ fontSize: 14 }}>
                  Chúng tôi sẽ không cho {authorName} biết ai đã báo cáo
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ minWidth: 30, flexDirection: 'row', justifyContent: 'center' }}>
                <IconF name='window-close' size={30} color={color.textColor} />
              </View>
              <View style={{ marginRight: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: color.textColor }}>
                  Ẩn bài viết này
                </Text>
                <Text style={{ fontSize: 14 }}>Ẩn bớt các bài viết tương tự</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
        {isOwnPost && (
          <>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
              onPress={handleNavigationEditPost}
            >
              <View style={{ minWidth: 30, flexDirection: 'row', justifyContent: 'center' }}>
                <IconF name='edit' size={30} color={color.textColor} />
              </View>
              <View style={{ marginRight: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: color.textColor }}>
                  Chỉnh sửa bài viết
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
              onPress={handleDeletePost}
            >
              <View style={{ minWidth: 30, flexDirection: 'row', justifyContent: 'center' }}>
                <IconF name='trash' size={30} color={color.textColor} />
              </View>
              <View style={{ marginRight: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: color.textColor }}>
                  Xóa bài viết
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ minWidth: 30, flexDirection: 'row', justifyContent: 'center' }}>
            <IconF name='bell' size={30} color={color.textColor} />
          </View>
          <View style={{ marginRight: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: color.textColor }}>
              Bật thông báo về bài viết này
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ minWidth: 30, flexDirection: 'row', justifyContent: 'center' }}>
            <IconF5 name='copy' size={30} color={color.textColor} />
          </View>
          <View style={{ marginRight: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: color.textColor }}>
              Sao chép liên kết
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export default ReportModal;
