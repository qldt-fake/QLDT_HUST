import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Button,
  Text,
  RefreshControl, Alert
} from 'react-native';
import NotificationBox from 'src/screens/notification/components/NotificationBox/NotificationBox';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppNaviagtionName, NotificationNavigationName } from 'src/common/constants/nameScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getNotificationsApi,
  INotificationResponse,
  markNotificationAsReadApi
} from 'src/services/noti.services';
import { useSelector } from 'react-redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import messaging from "@react-native-firebase/messaging";

type Notification = {
  id: number;
  title: string;
  content: string;
  date: string;
  read: boolean;
};

const NotificationHome: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [serverError, setServerError] = useState<boolean>(false);
  const navigation: NavigationProp<any> = useNavigation();
  const auth = useSelector(selectAuth);
  const user = auth.user;
  const PAGE_SIZE = 4;
  const handleForegroundMessages = () => {
    messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived in foreground!', remoteMessage);

      // Hiển thị thông báo hoặc xử lý tùy ý
      console.log(remoteMessage);
    });
  };
  const markAsRead = async (id: number) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    try {
      if (user != null)
        await markNotificationAsReadApi({
          token: user.token,
          notification_ids: [id]
        });
    } catch (err) {
      console.log(err);
    }
    setNotifications(updatedNotifications);
  };

  const loadNotifications = async (loadMore = false) => {
    if (user == null) return;

    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      setServerError(false);
      const response = await getNotificationsApi({
        token: user.token,
        index: loadMore ? page * PAGE_SIZE : 0,
        count: PAGE_SIZE
      });

      // @ts-ignore
      if (response.meta.code === '1000') {
        const notificationsData: Notification[] = response.data.map(
          (item: INotificationResponse) => ({
            id: item.id,
            title: item.type,
            content: item.message,
            date: item.sent_time,
            read: item.status !== 'UNREAD'
          })
        );

        if (notificationsData.length < PAGE_SIZE) {
          setHasMore(false);
        } else if (!hasMore) setHasMore(true);

        setNotifications(loadMore ? [...notifications, ...notificationsData] : notificationsData);
        setPage(loadMore ? page + 1 : 1);
      } else {
        // @ts-ignore
        console.error('Failed to load notifications ' + response.meta.code);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setServerError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  useEffect(() => {
    handleForegroundMessages();
    console.log(user?.id);
    console.log(user?.token);
    loadNotifications();
  }, []);

  const renderEmptyComponent = () => {
    if (serverError) {
      return <Text style={styles.emptyText}>Không có kết nối</Text>;
    } else if (!loading && notifications.length === 0) {
      return <Text style={styles.emptyText}>Không có thông báo</Text>;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.notificationItem, isSelected && styles.selectedNotification]}
              onPress={() => {
                  markAsRead(item.id);
                  navigation.navigate(AppNaviagtionName.NotificationNavigation, {
                    screen: NotificationNavigationName.NotificationDetail,
                    params: {
                      title: item.title,
                      content: item.content
                    }
                  });
                }
              }
            >
              <NotificationBox
                title={item.title}
                content={item.content}
                date={item.date}
                read={item.read}
              />
            </TouchableOpacity>
          );
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={() => hasMore && loadNotifications(true)}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size='small' color='#007bff' /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  selectModeActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  notificationItem: {
    marginVertical: 5
  },
  selectedNotification: {
    backgroundColor: '#d3d3d3'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999'
  }
});

export default NotificationHome;
