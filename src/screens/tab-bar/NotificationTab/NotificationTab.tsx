import { useEffect, useRef, useState } from 'react';
import BaseFlatList from 'src/components/BaseFlatList';
import NotificationItem from './components/NotificationItem';
import {
  Avatar,
  Card,
  Divider,
  IconButton,
  Snackbar,
  Text,
  TouchableRipple
} from 'react-native-paper';
import BaseModal from 'src/components/BaseModal';
import { color } from 'src/common/constants/color';
import { View } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import {
  getNextNotifications,
  getNotifications,
  selectNotification
} from 'src/redux/slices/notificationSlice';
import { useAppDispatch } from 'src/redux';
import { INotificationItem } from 'src/services/notification.service';
import { ReadNotification } from 'src/common/enum/commom';
import globalStyles from 'src/common/styles/globalStyles';
const COUNT_ITEM = 10;

function NotificationTab() {
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [modalContent, setModalContent] = useState<INotificationItem | null>(null);
  const [isVisibleSnackbar, setIsVisibleSnackbar] = useState<boolean>(false);
  const onDismissSnackBar = () => setIsVisibleSnackbar(false);
  const visibleModal = (item: INotificationItem) => {
    setModalContent(item);
    setIsVisibleModal(true);
  };

  const hideModal = () => {
    setIsVisibleModal(false);
    setModalContent(null);
  };
  const onRemoveNotification = () => {
    hideModal();
    setIsVisibleSnackbar(true);
  };

  // call api
  const dispatch = useAppDispatch();
  const notificationStore = useSelector(selectNotification);

  const [skip, setSkip] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getNotifications({ index: 0, count: COUNT_ITEM }));
    setSkip(COUNT_ITEM);
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getNotifications({ index: 0, count: COUNT_ITEM }));
    setSkip(COUNT_ITEM);
    setRefreshing(false);
  };

  async function onEndReadable() {
    if (notificationStore.isNextFetch) {
      dispatch(getNextNotifications({ index: skip, count: COUNT_ITEM }));
      setSkip(skip => skip + COUNT_ITEM);
    }
  }

  // scroll to top
  const ref = useRef(null);
  useScrollToTop(ref);

  return (
    <>
      <View
        style={[
          globalStyles.flexRow,
          globalStyles.spaceBetweenJustify,
          globalStyles.centerAlignItem
        ]}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginLeft: 10 }}>Thông báo</Text>
        <IconButton icon='magnify' size={30} />
      </View>
      <BaseFlatList
        ref={ref}
        data={notificationStore.notification}
        renderItem={({ item }: { item: INotificationItem }) => (
          <NotificationItem
            ownerUri={item.avatar}
            isLook={item.read === ReadNotification.Read}
            time={item.created}
            type={item.type}
            onPressRightIcon={() => visibleModal(item)}
            onLongPress={() => visibleModal(item)}
            user={item.user}
            mark={item.mark}
            feel={item.feel}
            post={item.post}
            key={item.notification_id}
          />
        )}
        ListEmptyComponent={
          <Text variant='bodyLarge' style={{ textAlign: 'center', marginTop: '50%' }}>
            Không có thông báo
          </Text>
        }
        ItemSeparatorComponent={Divider}
        keyExtractor={item => item.notification_id}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReadable}
        onEndReachedThreshold={0.001}
        isFootterLoading={notificationStore.loading}
      />
      <BaseModal isVisible={isVisibleModal} onBackdropPress={hideModal}>
        <View style={{ display: 'flex', alignItems: 'center', marginBottom: 20, gap: 10 }}>
          <Avatar.Image
            source={
              modalContent?.avatar ? { uri: modalContent?.avatar } : require('src/assets/logo.png')
            }
            size={40}
          />
          <Text
            variant='bodySmall'
            style={{
              color: color.activeOutlineColor,
              textAlign: 'center',
              marginBottom: 4,
              paddingHorizontal: 24
            }}
          >
            {modalContent?.title}
          </Text>
        </View>
        <TouchableRipple rippleColor={color.borderColor} onPress={onRemoveNotification}>
          <Card.Title
            title={<Text variant='titleMedium'>Gỡ thông báo này</Text>}
            left={props => (
              <IconButton
                {...props}
                icon='close-box'
                containerColor={color.borderColor}
                size={24}
                style={{ height: 36, width: 36 }}
              />
            )}
          />
        </TouchableRipple>
      </BaseModal>

      <Snackbar
        visible={isVisibleSnackbar}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Hoàn tác',
          onPress: () => {
            // Do something
          }
        }}
      >
        Đã gỡ thông báo
      </Snackbar>
    </>
  );
}

export default NotificationTab;
