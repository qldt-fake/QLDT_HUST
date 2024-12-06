import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  Button,
  Alert
} from 'react-native';
import React, { useCallback, useState } from 'react';
import ClassCard from './ClassCard';
import { getClassListApi } from 'src/services/class.service';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'src/common/constants/color';
import { ClassNavigationName } from 'src/common/constants/nameScreen';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Roles } from 'src/common/enum/commom';
import { RootState } from 'src/redux';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import { useAppDispatch } from 'src/redux';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
import EmptyState from 'src/components/EmptyState';
import { logout } from 'src/redux/slices/authSlice';

const ClassListPage = () => {
  const [classList, setClassList] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const user = useSelector((state: RootState) => state.auth.user);
  const { token, role, id } = user || {};
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          dispatch(showLoading()); // Hiển thị loading trước khi fetch
          const res = await getClassListApi({
            token: token,
            role: role,
            account_id: id,
            pageable_request: {
              page: currentPage - 1,
              page_size: itemsPerPage
            }
          });
          if (res) {
            switch (res.meta?.code) {
              case CODE_OK:
                setClassList(res.data.page_content);
                setTotalRecords(res.data.page_info.total_records);
                break;
              case INVALID_TOKEN:
                Alert.alert('Lỗi', 'Token không hợp lệ');
                dispatch(logout());
                break;
              case NOT_ACCESS:
                Alert.alert('Lỗi', 'Bạn không có quyền truy cập');
                break;
              default:
                console.error('Lỗi:', res.meta?.message ?? 'Lỗi không xác định');
                break;
            }
          }
        } catch (error) {
          Alert.alert('Lỗi', 'Lấy danh sách lớp học thất bại');
        } finally {
          dispatch(hideLoading());
        }
      };

      fetchData();
    }, [token, role, id,   currentPage])
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalRecords / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <ClassCard {...item} setClassList={setClassList} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Danh sách lớp trong học kỳ :</Text>
      <View style={styles.body}>
        {classList.length > 0 ? (
          <FlatList
            data={classList}
            renderItem={renderItem}
            contentContainerStyle={styles.classList}
          />
        ) : (
          <EmptyState
            title={
              'Bạn hiện chưa ' +
              (role === Roles.LECTURER ? 'quản lý ' : 'đăng ký ') +
              'lớp nào trong kỳ học này'
            }
          />
        )}
      </View>
      {totalRecords > 0 && (
        <View style={styles.pagination}>
          <View style={styles.pageButtonContainer}>
            <Button title='<' onPress={handlePreviousPage} disabled={currentPage === 1} />
          </View>
          <Text style={styles.pageIndicator}>
            {`${currentPage} / ${Math.ceil(totalRecords / itemsPerPage)}`}
          </Text>
          <View style={styles.pageButtonContainer}>
            <Button
              title='>'
              onPress={handleNextPage}
              disabled={currentPage === Math.ceil(totalRecords / itemsPerPage)}
            />
          </View>
        </View>
      )}
      {role === Roles.LECTURER && (
        <Pressable
          style={styles.floatingButton}
          onPress={() => navigation.navigate(ClassNavigationName.CreateClass as never)}
        >
          <Icon name='plus' size={20} color={color.white} />
        </Pressable>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    marginTop: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
    zIndex: 0
  },
  title: {
    margin: 10,
    fontSize: 18
  },
  body: {
    padding: 10,
    height: 600
  },
  classList: {
    gap: 10
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: color.red,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  pageButtonContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10
  },
  pageIndicator: {
    fontSize: 16
  }
});

export default ClassListPage;
