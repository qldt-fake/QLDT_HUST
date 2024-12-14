import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableHighlight,
    Alert
} from 'react-native';
import ClassHeader from '../general/ClassHeader';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from 'react-native-date-picker';
import {color} from 'src/common/constants/color';
import {createSurveyApi} from 'src/services/survey.service';
import {ReponseCode} from 'src/common/enum/reponseCode';
import dayjs from 'dayjs';
import {useSelector} from 'react-redux';
import {logout, selectAuth} from 'src/redux/slices/authSlice';
import {selectFile} from 'src/utils/helper';
import {CODE_OK, INVALID_TOKEN, NOT_ACCESS, PARAM_VALUE_INVALID} from 'src/common/constants/responseCode';
import {useAppDispatch} from 'src/redux';
import {useNavigation} from '@react-navigation/native';
import {hideLoading, showLoading} from 'src/redux/slices/loadingSlice';
import {AbsenceRequestProps, IAbsencePayload} from 'src/interfaces/absence.interface';
import {requestAbsenceApi} from 'src/services/absence.service';
import {getBasicClassInfoApi} from "src/services/class.service";
import {sendNotificationApi} from "src/services/noti.services";
import { selectClassDetails } from 'src/redux/slices/classDetailsSlice';


const AbsenceRequest: React.FC<any> = ({route}: any) => {
    const auth = useSelector(selectAuth);
    const user = auth.user;
    const classId = route?.params?.classId;
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const classDetails : any = useSelector(selectClassDetails);
    console.log('classDetails', classDetails);

    const [newAbsenceRequest, setNewAbsenceRequest] = useState<IAbsencePayload>({
        title: '',
        reason: '',
        file: null,
        date: null
    });

    const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);

    const handleChange = (name: keyof IAbsencePayload, value: string | object | Date | null | any) => {
        setNewAbsenceRequest(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleShowDatePicker = () => {
        setIsOpenDatePicker(true);
    };

    const handleSelectFile = async () => {
        const file = await selectFile();
        if (file) {
            handleChange('file', file);
        }
    };

    const validate = () => {
        // Kiểm tra nếu tên bài kiểm tra không được nhập
        if (!newAbsenceRequest?.title?.trim()) {
            Alert.alert('Lỗi', 'Tiêu đề là trường bắt buộc');
            return false;
        }

        // Kiểm tra nếu không có mô tả hoặc tài liệu được tải lên
        if (!newAbsenceRequest?.reason?.trim() && !newAbsenceRequest.file) {
            Alert.alert('Lỗi', 'Vui lòng nhập lý do hoặc tải file minh chứng lên');
            return false;
        }

        // Giới hạn ký tự cho phần mô tả (ví dụ: tối đa 500 ký tự)
        const MAX_DESCRIPTION_LENGTH = 500;
        if ((newAbsenceRequest?.reason?.trim().length ?? 0) > MAX_DESCRIPTION_LENGTH) {
            Alert.alert('Lỗi', `Lý do không được vượt quá ${MAX_DESCRIPTION_LENGTH} ký tự`);
            return false;
        }

        // Kiểm tra thời gian bắt đầu và thời gian kết thúc
        const currentTime = new Date();
        if (newAbsenceRequest.date && newAbsenceRequest.date <= currentTime) {
            Alert.alert('Lỗi', 'Thời gian xin nghỉ phải lớn hơn thời gian hiện tại');
            return false;
        }

        if (!newAbsenceRequest.date || isNaN((newAbsenceRequest.date as Date).getTime())) {
            Alert.alert('Lỗi', 'Vui lòng chọn ngày hợp lệ');
            return false;
          }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }

        try {

            const payload = {
                token: user?.token,
                classId: classId,
                title: newAbsenceRequest.title,
                reason: newAbsenceRequest.reason,
                date: dayjs(newAbsenceRequest.date).format('YYYY-MM-DD'),
                file: newAbsenceRequest.file
            };
            console.log('payload', payload);
            dispatch(showLoading());
            const res = await requestAbsenceApi(payload);
            console.log('res', res);
            if (res) {
                switch (res.meta?.code) {
                    case CODE_OK:
                        if(classDetails != null)
                        await sendNotificationApi({
                            token: user?.token,
                            message: "Mã lớp: " + classDetails.class_id+ "\nTên sinh viên:" + user?.name +
                                "\nTiêu đề: " + newAbsenceRequest.title + "\nNội dung: " + newAbsenceRequest.reason +
                                "\nNgay xin nghi: " + newAbsenceRequest.date,
                            type: "ABSENCE",
                            toUser: classDetails.lecturer_account_id,
                            image: newAbsenceRequest.file
                        });
                        
                        Alert.alert('Thành công', 'Tạo yêu cầu xin nghỉ thành công');
                        navigation.goBack();
                        break;
                    case INVALID_TOKEN:
                        Alert.alert('Lỗi', 'Token không hợp lệ');
                        dispatch(logout());
                        break;
                    case NOT_ACCESS:
                        Alert.alert('Lỗi', 'Bạn không có quyền tạo đơn xin nghỉ');
                        break;
                    case PARAM_VALUE_INVALID: 
                        Alert.alert('Lỗi', 'Dữ liệu không hợp lệ' + typeof res.data === 'string' ? res.data : (JSON.stringify(res.data) ?? ''));
                        break;
                    default:
                        Alert.alert('Lỗi', res.data ?? 'Có lỗi xảy ra với sever');
                        break;
                }
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Lỗi khi tạo yêu cầu xin nghỉ');
            console.error(error);
        } finally {
            dispatch(hideLoading());
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <TextInput
                    style={styles.name}
                    value={newAbsenceRequest?.title as string}
                    onChangeText={text => handleChange('title', text)}
                    placeholder='Title'
                    placeholderTextColor={color.submitBtnRed}
                />
                <TextInput
                    style={[styles.name, styles.reason]}
                    value={newAbsenceRequest?.reason as string}
                    onChangeText={text => handleChange('reason', text)}
                    placeholder='Reason'
                    multiline
                    numberOfLines={6}
                    placeholderTextColor={color.submitBtnRed}
                />
                <Text style={[styles.text, styles.orText]}>Or</Text>

                <TouchableHighlight style={styles.fileButton} onPress={handleSelectFile}>
                    <>
                        <Text
                            style={[styles.text, styles.fileButtonText]}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                        >
                            {newAbsenceRequest?.file ? newAbsenceRequest.file.name : 'Upload File'}
                        </Text>
                        <Icon name='caret-up' size={20} color='#fff'/>
                    </>
                </TouchableHighlight>
                {isOpenDatePicker && (
                    <DateTimePicker
                        date={newAbsenceRequest?.date as Date ?? new Date()}
                        onConfirm={date => {
                            setIsOpenDatePicker(false);
                            handleChange('date', date);
                        }}
                        onCancel={() => setIsOpenDatePicker(false)}
                        mode='date'
                        androidVariant='nativeAndroid'
                        textColor={color.red}
                        modal
                        open
                    />
                )}
                <View style={styles.period}>
                    <TouchableOpacity style={styles.selectPeriod} onPress={handleShowDatePicker}>
                        <Text style={{color: color.borderRed}}>
                            {newAbsenceRequest.date ? newAbsenceRequest.date.toLocaleString() : 'Date'}
                        </Text>
                        <Icon name='caret-down' size={20} color={color.borderRed}/>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={[styles.text, styles.submitButtonText]}>Tạo</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    body: {
        padding: 30
    },
    name: {
        borderWidth: 1,
        borderColor: color.borderRed,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#f2f2f2'
    },
    text: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    reason: {
        height: 200,
        textAlignVertical: 'top'
    },
    orText: {
        textAlign: 'center',
        marginVertical: 10,
        color: color.borderRed
    },
    fileButton: {
        backgroundColor: color.borderRed,
        padding: 15,
        borderRadius: 20,
        marginBottom: 20,
        marginHorizontal: 60,
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    fileButtonText: {
        textAlign: 'center',
        maxWidth: '80%'
    },
    period: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 20
    },
    selectPeriod: {
        borderColor: color.borderRed,
        borderWidth: 1,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        flex: 1,
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row'
    },
    submitButton: {
        backgroundColor: color.red,
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 110,
        height: 50,
        justifyContent: 'center'
    },
    submitButtonText: {
        textAlign: 'center'
    }
});

export default AbsenceRequest;
