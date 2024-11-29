import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  TextInput
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from 'src/redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { showLoading, hideLoading } from 'src/redux/slices/loadingSlice';
import { getSubmissionApi } from 'src/services/survey.service';
import { color } from 'src/common/constants/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatDateTime } from 'src/utils/helper';
import { DATE_TIME_FORMAT } from 'src/common/constants';
import { CODE_OK, INVALID_TOKEN, NOT_ACCESS } from 'src/common/constants/responseCode';

const SubmissionDetail: React.FC<any> = ({ route }: any) => {
  const { id, title, deadline, file_url, description } = route?.params as any;
  const auth = useSelector(selectAuth);
  const user = auth.user;
  const dispatch = useAppDispatch();
  const [submissionData, setSubmissionData] = useState<any>(null);

  useEffect(() => {
    const fetchSubmissionData = async () => {
      try {
        const payload = {
          token: user?.token,
          assignment_id: id
        };
        dispatch(showLoading());
        const response = await getSubmissionApi(payload);
        if(response) {
          switch(response.meta?.code) {
            case CODE_OK:
              setSubmissionData(response.data);
              break;
            case INVALID_TOKEN:
              Alert.alert('Lỗi', 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
              break;
            case NOT_ACCESS:
              Alert.alert('Lỗi', 'Bạn không có quyền truy cập');
              break;
            default:
              Alert.alert('Lỗi', response.data ?? 'Lỗi xảy ra với server');
              break;
          }
        }
      } catch (error) {
        console.error('Error fetching submission data:', error);
        Alert.alert('Lỗi', 'Tạm thời không thể tải dữ liệu bài kiểm tra');
      } finally {
        dispatch(hideLoading());
      }
    };
    fetchSubmissionData();
  }, [id]);

  const handleViewFile = (type: string) => {
    if (type === 'uploaded' && file_url) {
      Linking.openURL(file_url);
    } else if (type === 'submited' && submissionData?.file_url) {
      Linking.openURL(submissionData.file_url);
    } else {
      Alert.alert('Thông báo', 'Không có file để xem');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.submitTimeBox}>
        <Text style={styles.submitTimeText}>
          {`Đã nộp bài ${formatDateTime(
            DATE_TIME_FORMAT.hh_mm_ss_vi_DD_MM_YYYY_DOT,
            new Date(submissionData?.submission_time)
          )}`}
        </Text>
      </View>
      <View style={styles.body}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text>{`Đến hạn vào ${formatDateTime(
            DATE_TIME_FORMAT.hh_mm_ss_vi_DD_MM_YYYY_DOT,
            new Date(deadline)
          )}`}</Text>
        </View>
        <View>
          <Text style={styles.label}>Hướng dẫn</Text>
          <Text>{description ?? 'Không có'}</Text>
        </View>
        <View>
          <Text style={styles.label}>Tài liệu tham khảo</Text>
          {file_url ? (
            <TouchableOpacity style={styles.fileButton} onPress={() => handleViewFile('uploaded')}>
              <>
                <Text
                  style={[styles.text, styles.fileButtonText]}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  Xem tài liệu tham khảo
                </Text>
                <Icon name='caret-up' size={20} color='#fff' />
              </>
            </TouchableOpacity>
          ) : (
            <Text>Không có file đính kèm</Text>
          )}
        </View>

        <View>
          <Text style={styles.label}>Phản hồi</Text>
          {submissionData?.text_response ? (
            <TextInput
              value={submissionData?.text_response ?? ''}
              multiline
              numberOfLines={3}
              editable={false}
              style={styles.textResponse}
            />
          ) : (
            <Text>Không có phản hồi</Text>
          )}
        </View>

        <View>
          <Text style={styles.label}>File đã nộp</Text>
          {submissionData?.file_url ? (
            <TouchableOpacity style={styles.fileButton} onPress={() => handleViewFile('submited')}>
              <>
                <Text
                  style={[styles.text, styles.fileButtonText]}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  Xem file đã nộp
                </Text>
                <Icon name='caret-up' size={20} color='#fff' />
              </>
            </TouchableOpacity>
          ) : (
            <Text>Không có file đã tải lên</Text>
          )}
        </View>

        <View>
          <Text style={styles.label}>Điểm</Text>
          <Text>{`${submissionData?.grade}/10`}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  submitTimeBox: {
    backgroundColor: color.yellow,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  submitTimeText: {
    fontSize: 16,
    fontStyle: 'italic'
  },
  body: {
    padding: 20,
    rowGap: 15
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  deadline: {
    fontSize: 16,
    color: color.backGroundgGray
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: color.textGray,
    marginTop: 5
  },
  fileButtonText: {
    fontWeight: 'bold',
    marginLeft: 10,
    color: color.primary
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  textResponse: {
    borderWidth: 1,
    borderColor: color.textGray,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    textAlignVertical: 'top' // Đảm bảo văn bản bắt đầu từ đầu dòng
  }
});

export default SubmissionDetail;
