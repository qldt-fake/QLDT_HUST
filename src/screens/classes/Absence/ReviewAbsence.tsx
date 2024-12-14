import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { color } from 'src/common/constants/color';
import { useSelector } from 'react-redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { useAppDispatch } from 'src/redux';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';
import { reviewAbsenceApi } from 'src/services/absence.service';
import { absenceStatus } from 'src/common/enum/commom';
import { sendNotificationApi } from "src/services/noti.services";
import { selectClassDetails } from 'src/redux/slices/classDetailsSlice';

const AbsenceReview = ({ route }: any) => {
  const navigation = useNavigation();
  const { id, student_account, absence_date, reason, status } = route?.params?.request as any;
  console.log(route?.params?.request);

  const auth = useSelector(selectAuth);
  const dispatch = useAppDispatch();
  const classDetails: any = useSelector(selectClassDetails);
  console.log(classDetails);

  const [currentStatus, setCurrentStatus] = useState<absenceStatus>(status);

  const handleReview = async (newStatus: absenceStatus.ACCEPTED | absenceStatus.REJECTED) => {
    try {
      dispatch(showLoading());
      const res = await reviewAbsenceApi({
        token: auth?.user?.token,
        request_id: id,
        status: newStatus
      });
      if (res) {
        switch (res.meta?.code) {
          case CODE_OK:
            Alert.alert('Thành công', 'Đã cập nhật trạng thái đơn xin nghỉ');
            await sendNotificationApi({
              token: auth?.user?.token,
              // class_id : classDetails?.class_id,
              message:
                "Mã lớp: " + classDetails?.class_id + "\n" +
                (newStatus === absenceStatus.ACCEPTED
                  ? "Giảng viên đã chấp thuận đơn xin nghỉ học"
                  : "Giảng viên đã từ chối đơn xin nghỉ học"),
              type: newStatus === absenceStatus.ACCEPTED ? "ACCEPT_ABSENCE_REQUEST" : "REJECT_ABSENCE_REQUEST",
              toUser: student_account.account_id,
            });
            navigation.goBack();
            break;
          case INVALID_TOKEN:
            Alert.alert('Lỗi', 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
            break;
          case NOT_ACCESS:
            Alert.alert('Lỗi', 'Bạn không có quyền truy cập');
            navigation.goBack()
            break;
          default:
            Alert.alert('Lỗi', res.meta?.message ?? 'Lỗi xảy ra với server');
            break;
        }
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xử lý yêu cầu');
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Thông tin sinh viên</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Họ và tên:</Text>
          <Text
            style={styles.value}
          >{`${student_account?.first_name} ${student_account?.last_name}`}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{student_account?.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mã sinh viên:</Text>
          <Text style={styles.value}>{student_account?.student_id}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.header}>Chi tiết đơn xin nghỉ</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Ngày nghỉ:</Text>
          <Text style={styles.value}>{absence_date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Lý do:</Text>
          <Text style={styles.value}>{reason ?? 'Không có lý do'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Trạng thái hiện tại:</Text>
          <Text
            style={[
              styles.value,
              currentStatus === absenceStatus.PENDING
                ? styles.pending
                : currentStatus === absenceStatus.ACCEPTED
                  ? styles.accepted
                  : styles.rejected
            ]}
          >
            {currentStatus === absenceStatus.PENDING
              ? 'Đang chờ'
              : currentStatus === absenceStatus.ACCEPTED
                ? 'Đã duyệt'
                : 'Bị từ chối'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleReview(absenceStatus.ACCEPTED)}
        >
          <Text style={styles.buttonText}>Duyệt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleReview(absenceStatus.REJECTED)}
        >
          <Text style={styles.buttonText}>Từ chối</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: color.backgroundColor },
  card: {
    backgroundColor: color.white,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: color.borderColor
  },
  header: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: color.primary },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  label: { fontSize: 16, fontWeight: '500', color: color.textGray },
  value: { fontSize: 16, color: color.black, flexShrink: 1, textAlign: 'right' },
  pending: { color: color.yellow },
  accepted: { color: color.green },
  rejected: { color: color.red },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 10
  },
  acceptButton: { backgroundColor: color.green },
  rejectButton: { backgroundColor: color.red },
  buttonText: { color: color.white, fontSize: 16, fontWeight: '600' }
});

export default AbsenceReview;
