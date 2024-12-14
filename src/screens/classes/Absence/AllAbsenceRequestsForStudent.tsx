import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, TextInput, ScrollView, Alert, SafeAreaView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'src/redux';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
import { selectAuth } from 'src/redux/slices/authSlice';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import EmptyState from 'src/components/EmptyState';
import { color } from 'src/common/constants/color';
import { getStudentAbsenceRequestsApi } from 'src/services/absence.service';
import BaseButton from 'src/components/BaseButton';
import { formatDateTime } from 'src/utils/helper';
import { DATE_TIME_FORMAT } from 'src/common/constants';
import { AbsenceNavigationName } from 'src/common/constants/nameScreen';
import { absenceStatus } from 'src/common/enum/commom';

const AllAbsenceRequestsForStudent = () => {
  const [absenceRequests, setAbsenceRequests] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState<absenceStatus | null>(null); // null, ACCEPTED, PENDING, REJECTED
  const [searchClassId, setSearchClassId] = useState<string | null>(null); // Từ khóa tìm kiếm
  const itemsPerPage = 10;
  const auth = useSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();


  // Hàm gọi API lấy đơn xin nghỉ
  const fetchLeaveRequests = async (
    page = currentPage,
    status: absenceStatus | null = null,
    classId: any = null
  ) => {
    try {
      classId = (classId === null || classId?.trim() === '') ? null : classId; // Nếu classId trống thì gán null
      dispatch(showLoading());
      const res = await getStudentAbsenceRequestsApi({
        token: auth?.user?.token,
        class_id: classId,
        status: status,
        pageable_request: {
          page: page - 1,
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
      console.log('fetchLeaveRequests', error);
    } finally {
      dispatch(hideLoading());
    }
  };

  // Hàm gọi API khi cần thay đổi bộ lọc hoặc chuyển trang
  useFocusEffect(
    useCallback(() => {
        fetchLeaveRequests(currentPage, selectedStatus, searchClassId); // Gọi API tự động nếu searchClassId trống
    }, [auth, currentPage, selectedStatus]) // Thêm searchClassId vào deps để theo dõi sự thay đổi
  );

  useEffect(() => {
    if(searchClassId ===null || searchClassId?.trim() === '')  {
      setSearchClassId(null); // Gán searchClassId = null
      fetchLeaveRequests(currentPage, selectedStatus, null); // Gọi API khi searchClassId thay đổi
    } // Nếu searchClassId không trống
 
  }
  , [searchClassId]); // Thêm searchClassId vào deps để theo dõi sự thay đổi

  const handleFilterChange = (status: absenceStatus | null) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  const handleSearch = () => {
    fetchLeaveRequests(currentPage, selectedStatus, searchClassId); // Chỉ gọi API khi người dùng bấm tìm kiếm
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.name}>{item?.class_id}</Text>
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên hoặc lý do..."
          value={searchClassId as string}
          onChangeText={text => setSearchClassId(text as string)}
        />
        <BaseButton
          borderRadius={12}
          buttonColor={color.primary}
          textColor="white"
          mode="contained"
          onPress={handleSearch} // Bấm "Tìm kiếm" mới gọi API
        >
          Tìm kiếm
        </BaseButton>
      </View>

      <View style={styles.filters}>
        <BaseButton
          borderRadius={12}
          buttonColor={selectedStatus === absenceStatus.PENDING ? color.textRed : color.activeOutlineColor}
          textColor="white"
          mode="contained"
          onPress={() => handleFilterChange(absenceStatus.PENDING)}
        >
          Đang chờ
        </BaseButton>
        <BaseButton
          borderRadius={12}
          buttonColor={selectedStatus === absenceStatus.ACCEPTED ? color.textRed : color.activeOutlineColor}
          textColor="white"
          mode="contained"
          onPress={() => handleFilterChange(absenceStatus.ACCEPTED)}
        >
          Đã duyệt
        </BaseButton>
        <BaseButton
          borderRadius={12}
          buttonColor={selectedStatus === absenceStatus.REJECTED ? color.textRed : color.activeOutlineColor}
          textColor="white"
          mode="contained"
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
          contentContainerStyle={styles.list}
        />
      ) : (
        <EmptyState title="Không có đơn xin nghỉ nào" />
      )}

      {totalRecords > 0 && (
        <View style={styles.pagination}>
          <Button
            title="<"
            onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          <Text style={styles.pageIndicator}>{`${currentPage} / ${Math.ceil(totalRecords / itemsPerPage)}`}</Text>
          <Button
            title=">"
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
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, columnGap: 10 },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: color.borderColor,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: color.white,
    color: color.black
  },
  filters: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  list: { paddingBottom: 20 },
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

export default AllAbsenceRequestsForStudent;
