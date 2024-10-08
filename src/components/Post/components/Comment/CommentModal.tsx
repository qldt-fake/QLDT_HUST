import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  Alert,
  FlatList,
  BackHandler
} from 'react-native';
import Modal from 'react-native-modal';
import styles from './styles';
import { color } from 'src/common/constants/color';
import { ActivityIndicator, Avatar, Divider, TouchableRipple } from 'react-native-paper';
import { getAvatarUri } from 'src/utils/helper';
import { getMarkCommentApi, setFeelApi, setMarkCommentApi } from 'src/services/comment.service';
import { useEffect, useState, useRef } from 'react';
import { IListCommentPost } from 'src/interfaces/comments.interface';
import { coverTimeToNow } from 'src/utils/dayjs';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppNaviagtionName, PostNavigationName } from 'src/common/constants/nameScreen';
import { useAppDispatch } from 'src/redux';
import { changeCoins } from 'src/redux/slices/authSlice';
interface CommentTabProps {
  id: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  listMarkComment: IListCommentPost[];
  setListMarkComment: React.Dispatch<React.SetStateAction<IListCommentPost[]>>;
  numberFeel: number;
}
const CommentTab = (props: CommentTabProps) => {
  const { id, openModal, setOpenModal, setListMarkComment, listMarkComment, numberFeel } = props;
  // const [listMarkComment, setListMarkComment] = useState<IListCommentPost[]>([]);
  const dispatch = useAppDispatch();
  const [skip, setSkip] = useState<number>(0);
  const [isNext, setIsNext] = useState<boolean>(false);
  const [isLoadingSendComment, setIsLoadingSendComment] = useState<boolean>(false);
  const [isNextFetch, setIsNextFetch] = useState<boolean>(true);
  const [isLoadingFirstApi, setIsLoadingFirstAPi] = useState<boolean>(false);
  const [markId, setMarkId] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [isComment, setIsComment] = useState(false);
  const [typeMark, setTypeMark] = useState<number>(1);
  // const [isMark, setIsMark] = useState<number>(1);
  const [isLike, setIsLike] = useState(false);
  const COUNT_ITEM = 10;

  const textInputRef = useRef<TextInput>(null);
  useEffect(() => {
    if (openModal) {
      setIsLoadingFirstAPi(true);
      setIsNextFetch(true);
      setSkip(COUNT_ITEM);
      setTimeout(() => {
        setIsLoadingFirstAPi(false);
      }, 1500);
    }
  }, [openModal]);

  async function onEndReadable() {
    if (isNextFetch) {
      try {
        setIsNext(true);
        setSkip(skip => skip + COUNT_ITEM);
        const res = await getMarkCommentApi({
          id: id,
          index: skip,
          count: COUNT_ITEM
        });
        if (res.success) {
          if (!res.data.length) {
            setIsNextFetch(false);
            return;
          }
          // console.log(skip, res.data);
          const response = res.data;
          if (res.data.length) {
            //console.log('searchResult', searchResult);
            setListMarkComment(listMarkComments => [...listMarkComments, ...response]);
          }
        }
      } catch (e) {
        setSkip(skip => skip - COUNT_ITEM);
        return;
      } finally {
        setIsNext(false);
      }
    }
  }
  // const navigateEditProfileScreen = () => navigation.navigate('EditProfile');
  const handleCancel = () => {
    setOpenModal(false);
  };
  const handlerypeMark = () => {
    Alert.alert(
      'Đánh giá bài viết',
      'Hãy đánh giá về độ tin cậy của bài viết Trust là tin cậy và Fake là không tin cậy!!!',
      [
        {
          text: 'HỦY',
          style: 'cancel'
        },
        {
          text: 'TRUST',
          onPress: () => {
            setTypeMark(1);
          }
        },
        {
          text: 'FAKE',
          onPress: () => {
            setTypeMark(0);
          }
        }
      ]
    );
  };
  const handlePressEnter = async () => {
    if (commentText && commentText !== '') {
      try {
        setIsLoadingSendComment(true);
        const result = await setMarkCommentApi({
          id: id,
          content: commentText,
          index: 0,
          count: 10,
          mark_id: markId == 0 ? null : markId,
          type: typeMark
        });
        if (result.success) {
          if (!result.data.length) {
            return;
          }
          setListMarkComment(result.data);
          dispatch(changeCoins(result.data.coins));
          // const response = res.data;
        }
      } catch (e) {
        return;
      } finally {
        setIsLoadingSendComment(false);
      }
    }
    setCommentText('');
    setSkip(0);
    setMarkId(0);
  };

  const handleTextChange = (e: any) => {
    setCommentText(e);
  };
  const handleResponse = (id_comment: string) => {
    if (textInputRef.current) {
      textInputRef.current?.focus();
      setMarkId(parseInt(id_comment, 10));
    }
  };
  // console.log('id', id)
  // const ModalComment = ({ visible, onClose, children }: { visible: boolean, onClose: () => void, children: React.ReactNode }) => {
  //   const translateY = useRef(new Animated.Value(0)).current;
  //   const panResponder = useRef(
  //     PanResponder.create({
  //       onStartShouldSetPanResponder: () => true,
  //       onMoveShouldSetPanResponderCapture: (_, gestureState) =>
  //         gestureState.dy > 2 || gestureState.dy < -2,
  //       onPanResponderMove: Animated.event([null, { dy: translateY }], { useNativeDriver: false }),
  //       onPanResponderRelease: (_, gestureState) => {
  //         if (gestureState.dy > 50) {
  //           onClose();
  //         } else {
  //           Animated.spring(translateY, {
  //             toValue: 0,
  //             useNativeDriver: false
  //           }).start();
  //         }
  //       }
  //     })
  //   ).current;

  //   useEffect(() => {
  //     if (visible) {
  //       translateY.setValue(0);
  //     }
  //   }, [visible]);
  //   return (
  //     <Modal transparent visible={visible} animationType='slide' onRequestClose={onClose}>
  //       <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'flex-end' }}>
  //         <Animated.View
  //           style={{
  //             transform: [{ translateY }]
  //           }}
  //           {...panResponder.panHandlers}
  //         >
  //           <View style={{ height: 50, width: '100%', backgroundColor: color.black }}></View>
  //         </Animated.View>
  //         <View style={{ flex: 1 }}>
  //           {children}
  //         </View>
  //       </View>
  //     </Modal>
  //   );
  // }
  const handleSetLike = async (id: string) => {
    try {
      const res = await setFeelApi({
        id: id,
        type: 1
      });
      if (res.success) {
        setIsLike(true);
        dispatch(changeCoins(res.data.coins));
      }
    } catch (e) {
      return;
    }
    // setOpenModalFeel(false);
  };

  //handle navigaiton feel screen
  const navigationFeelScreen: NavigationProp<AppNavigationType, AppNaviagtionName.PostNavigation> =
    useNavigation();
  const handleNavigationFeelScreen = () =>
    navigationFeelScreen.navigate(AppNaviagtionName.PostNavigation, {
      screen: PostNavigationName.ListFeelScreen,
      params: { postId: id }
    });
  useEffect(() => {
    const backAction = () => {
      handleCancel();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);
  return (
    <Modal
      // visible={openModal}
      // onClose={handleCancel}
      animationIn='slideInUp'
      // animationOut='slideInDown'
      isVisible={openModal}
      style={styles.container}
      onBackdropPress={handleCancel}
    >
      {isLoadingFirstApi ? (
        <ActivityIndicator
          color={color.activeOutlineColor}
          style={{ marginTop: '50%', backgroundColor: color.white }}
        />
      ) : (
        <View
          style={{
            backgroundColor: color.white,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10
          }}
        >
          <TouchableHighlight
            style={styles.header}
            onPress={handleNavigationFeelScreen}
            underlayColor={color.Comment}
          >
            {/* <Text>đây là header comment</Text> */}
            <View style={styles.icon}>
              <View style={styles.left}>
                {numberFeel >= 1 && !isLike ? (
                  <View style={styles.listIcon}>
                    <AntdIcon
                      name='like1'
                      size={18}
                      color={color.likeIcon}
                      style={styles.rightIcon}
                    />
                    <AntdIcon
                      name='dislike1'
                      size={18}
                      color={color.iconButtonColor}
                      style={styles.rightIcon}
                    />

                    <Text style={{ color: color.iconButtonColor }}>
                      Có <Text style={{ fontWeight: 'bold' }}>{numberFeel}</Text> người đã bày tỏ
                      cảm xúc
                    </Text>

                    <AntdIcon
                      name='right'
                      size={18}
                      color={color.iconButtonColor}
                      style={styles.rightIcon}
                    />
                  </View>
                ) : numberFeel < 1 && isLike ? (
                  <View style={styles.listIcon1}>
                    <Text style={{ fontWeight: 'bold', color: color.black }}>
                      Bạn đã thích bài viết này
                    </Text>

                    <AntdIcon
                      name='like1'
                      size={22}
                      style={{ color: color.likeIcon }}
                      onPress={() => {
                        handleSetLike(id);
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.listIcon0}>
                    <Text style={{ fontWeight: 'bold', color: color.black }}>
                      Hãy là người đầu tiên thích tin này
                    </Text>

                    <AntdIcon
                      name='like2'
                      size={22}
                      // style={}
                      onPress={() => {
                        handleSetLike(id);
                      }}
                    />
                  </View>
                )}
              </View>
            </View>
          </TouchableHighlight>
          <View style={isComment ? { height: '75%' } : { height: '86%' }}>
            <FlatList
              ListHeaderComponent={() => (
                <TouchableHighlight style={{ padding: 10 }} underlayColor={color.Comment}>
                  <Text
                    // style={{ fontSize: 14, fontWeight: '700', marginBottom: 4 }}
                    style={styles.viewBeForeComment}
                  >
                    Tất cả bình luận
                  </Text>
                </TouchableHighlight>
              )}
              data={listMarkComment}
              ListEmptyComponent={
                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                  Bài viết chưa có bình luận nào
                </Text>
              }
              renderItem={({ item }) => (
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
                              source={getAvatarUri(item.poster.avatar)}
                              size={40}
                              style={styles.avatarImage}
                            />
                          </View>
                        </TouchableHighlight>
                        <View style={styles.Content}>
                          <Text style={styles.TextName}>{item.poster.name}</Text>
                          <Text style={styles.TextCommment}>{item.mark_content}</Text>
                        </View>
                      </View>
                      <View style={styles.Function}>
                        <Text style={styles.TextTime}>{coverTimeToNow(item.created)}</Text>
                        <TouchableHighlight
                          onPress={() => {}}
                          style={styles.highlightText}
                          underlayColor={color.Comment}
                        >
                          {item.type_of_mark == '1' ? (
                            <Text style={styles.TextTrust}> Trust</Text>
                          ) : (
                            <Text style={styles.TextFake}> Fake</Text>
                          )}
                        </TouchableHighlight>
                        <TouchableHighlight
                          onPress={() => {}}
                          style={styles.highlightConment}
                          underlayColor={color.Comment}
                        >
                          <Text
                            style={styles.TextResponse}
                            onPress={() => {
                              handleResponse(item.id);
                            }}
                          >
                            {' '}
                            Phản hồi
                          </Text>
                        </TouchableHighlight>
                      </View>
                      {(item.comments ?? []).length > 0
                        ? (item.comments ?? []).map((repItem: any, index: number) => (
                            <View key={index}>
                              <View style={styles.topRep}>
                                <TouchableHighlight
                                  onPress={() => {}}
                                  style={styles.touchableHighlight}
                                  underlayColor={color.Comment}
                                >
                                  <View>
                                    <Avatar.Image
                                      source={getAvatarUri(repItem.poster.avatar)}
                                      size={25}
                                      style={styles.avatarImage}
                                    />
                                  </View>
                                </TouchableHighlight>
                                <View style={styles.ContentRep}>
                                  <Text style={styles.TextNameRep}>{repItem.poster.name}</Text>
                                  <Text style={styles.TextCommmentRep}>{repItem.content}</Text>
                                </View>
                              </View>
                              <View style={styles.FunctionRep}>
                                <Text style={styles.TextTime}>
                                  {coverTimeToNow(repItem.created)}
                                </Text>
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
                          ))
                        : null}
                    </View>
                  </View>
                </>
              )}
              keyExtractor={item => item.id}
              ListFooterComponent={
                isNext ? (
                  <View style={{ marginTop: 20 }}>
                    <ActivityIndicator color={color.outlineColor} />
                  </View>
                ) : null
              }
              onEndReached={onEndReadable}
              onEndReachedThreshold={0.001}
            />
          </View>
          <Divider />
          <View
            style={{
              // flex:1,
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center'
            }}
          >
            <TextInput
              ref={textInputRef}
              onFocus={() => setIsComment(true)}
              onBlur={() => setIsComment(false)}
              placeholder='Viết bình luận'
              clearButtonMode='always'
              // onSubmitEditing={handlePressEnter}
              onChangeText={handleTextChange}
              value={commentText}
              style={{
                // flex:1,
                marginTop: 5,
                marginBottom: 5,
                height: 40,
                width: '70%',
                marginLeft: 15,
                borderRadius: 50,
                backgroundColor: color.backgroundColor,
                paddingLeft: 20
              }}
            />
            <TouchableHighlight>
              <FontAwesome6
                name='face-smile'
                size={25}
                // color={color.laughtIcon}
                style={styles.rightIcon}
                onPress={() => {
                  handlerypeMark();
                }}
              />
            </TouchableHighlight>
            <TouchableRipple
              style={{ paddingHorizontal: 10 }}
              onPress={isLoadingSendComment ? () => {} : handlePressEnter}
            >
              {isLoadingSendComment ? (
                <ActivityIndicator color={color.primary} />
              ) : (
                <Ionicons name='send' size={25} color={color.likeIcon} style={styles.rightIcon} />
              )}
            </TouchableRipple>
          </View>
        </View>
      )}
    </Modal>
  );
};

export default CommentTab;
