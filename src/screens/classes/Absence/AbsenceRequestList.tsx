import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Button
} from 'react-native';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'src/redux';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
import { selectAuth } from 'src/redux/slices/authSlice';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import EmptyState from 'src/components/EmptyState';
import { color } from 'src/common/constants/color';
import { getAbsenceListApi } from 'src/services/absence.service';
import BaseButton from 'src/components/BaseButton';
import { formatDateTime } from 'src/utils/helper';
import { DATE_TIME_FORMAT } from 'src/common/constants';
import { AbsenceNavigationName } from 'src/common/constants/nameScreen';
import { absenceStatus } from 'src/common/enum/commom';
import { AbsenceNavigationType } from 'src/common/type/navigation';

const AbsenceRequestList = ({ route }: any) => {
  const { classId } = route?.params as any;
  const [absenceRequests, setAbsenceRequests] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null); // null, ACCEPTED, PENDING, REJECTED
  const itemsPerPage = 10;
  const auth = useSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigation : NavigationProp<AbsenceNavigationType> = useNavigation();

  const handleReview = (request: any) => {
    navigation.navigate(AbsenceNavigationName.ReviewAbsence, { request }); // Điều hướng và truyền dữ liệu
  };

  useFocusEffect(
    useCallback(() => {
      const fetchLeaveRequests = async () => {
        try {
          dispatch(showLoading());
          const res = await getAbsenceListApi({
            token: auth?.user?.token,
            class_id: classId,
            status: selectedStatus,
            pageable_request: {
              page: currentPage - 1,
              page_size: itemsPerPage
            }
          });
          if (res) {
            switch (res.meta?.code) {
              case CODE_OK:
                setAbsenceRequests(res.data?.page_content ?? []);
                setTotalRecords(res.data?.page_info?.total_records ?? 0);
                break;
              case INVALID_TOKEN:
                Alert.alert('Lỗi', 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
                break;
              case NOT_ACCESS:
                Alert.alert('Lỗi', 'Bạn không có quyền truy cập');
                break;
              default:
                Alert.alert('Lỗi', res.meta?.message ?? 'Có lỗi xảy ra');
                break;
            }
          }
        } catch (error) {
          Alert.alert('Lỗi', 'Có lỗi xảy ra khi lấy dữ liệu đơn xin nghỉ');
        } finally {
          dispatch(hideLoading());
        }
      };
      fetchLeaveRequests();
    }, [auth, currentPage, selectedStatus])
  );

  const handleFilterChange = (status: absenceStatus | null) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => handleReview(item)}>
      <Text
        style={styles.name}
      >{`${item.student_account?.first_name} ${item.student_account?.last_name}`}</Text>
      <Text style={styles.email}>{item.student_account?.email}</Text>
      <Text style={styles.date}>
        Ngày nghỉ: {formatDateTime(DATE_TIME_FORMAT.DD_MM_YYYY_DASH, new Date(item.absence_date))}
      </Text>
      <Text style={styles.reason}>Lý do: {item.reason}</Text>
      <Text
        style={[
          styles.status,
          {
            color:
              item?.status === absenceStatus.PENDING
                ? color.yellow
                : item?.status === absenceStatus.ACCEPTED
                ? color.green
                : color.primary
          }
        ]}
      >
        Trạng thái:{' '}
        {item.status === absenceStatus.PENDING
          ? 'Đang chờ'
          : item.status === absenceStatus.ACCEPTED
          ? 'Đã duyệt'
          : 'Bị từ chối'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filters}>
        <BaseButton
          borderRadius={12}
          buttonColor={
            selectedStatus === absenceStatus.PENDING ? color.textRed : color.activeOutlineColor
          }
          textColor='white'
          mode='contained'
          onPress={() => handleFilterChange(absenceStatus.PENDING)}
        >
          Đang chờ
        </BaseButton>
        <BaseButton
          borderRadius={12}
          buttonColor={
            selectedStatus === absenceStatus.ACCEPTED ? color.textRed : color.activeOutlineColor
          }
          textColor='white'
          mode='contained'
          onPress={() => handleFilterChange(absenceStatus.ACCEPTED)}
        >
          Đã duyệt
        </BaseButton>
        <BaseButton
          borderRadius={12}
          buttonColor={
            selectedStatus === absenceStatus.REJECTED ? color.textRed : color.activeOutlineColor
          }
          textColor='white'
          mode='contained'
          onPress={() => handleFilterChange(absenceStatus.REJECTED)}
        >
          Từ chối
        </BaseButton>
      </View>

      {absenceRequests.length > 0 ? (
        <FlatList
          data={absenceRequests}
          renderItem={renderItem}
          keyExtractor={(item: any) => item?.id?.toString()}
        />
      ) : (
        <EmptyState title='Không có đơn xin nghỉ nào' />
      )}
      {totalRecords > 0 && (
        <View style={styles.pagination}>
          <Button
            title='<'
            onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          <Text style={styles.pageIndicator}>
            {`${currentPage} / ${Math.ceil(totalRecords / itemsPerPage)}`}
          </Text>
          <Button
            title='>'
            onPress={() =>
              setCurrentPage(prev =>
                prev < Math.ceil(totalRecords / itemsPerPage) ? prev + 1 : prev
              )
            }
            disabled={currentPage === Math.ceil(totalRecords / itemsPerPage)}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: color.backgroundColor, paddingBottom: 60 },
  filters: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  card: {
    backgroundColor: color.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: color.borderColor
  },
  name: { fontSize: 18, fontWeight: 'bold', color: color.black },
  email: { fontSize: 14, color: color.blackOpacity },
  date: { fontSize: 14, color: color.primary },
  reason: { fontSize: 14, color: color.textGray },
  status: { fontSize: 14, color: color.green },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  pageIndicator: { fontSize: 16, marginHorizontal: 10 }
});

export default AbsenceRequestList;
