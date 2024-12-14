import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Avatar, Button, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectAuth, setImage } from 'src/redux/slices/authSlice';
import { Roles } from 'src/common/enum/commom';
import styles from './styles';
import { convertGoogleDriveLink, getAvatarUri } from 'src/utils/helper'
import Icon from 'react-native-vector-icons/MaterialIcons'; // Cần cài đặt thư viện này
import { sendFileAPI } from 'src/services/sendFileService';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Alert } from 'react-native';
import { CODE_OK } from 'src/common/constants/responseCode';
import BaseModalSuccess from 'src/components/BaseModalSuccess';
import { useAppDispatch } from 'src/redux';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';


const ProfileScreen = () => {
    const auth = useSelector(selectAuth);
    const user = auth.user;
    const [textSuccess, setTextSuccess] = useState('')
    const dispatch = useAppDispatch()
    const handleEditAvatar = async () => {
        Alert.alert(
            'Cập nhật Avatar',
            'Chọn phương thức:',
            [
                {
                    text: 'Chụp ảnh',
                    onPress: async () => {
                        // Mở Camera
                        const cameraResult = await launchCamera({
                            mediaType: 'photo',
                            maxWidth: 500,
                            maxHeight: 500,
                            quality: 0.8,
                        });

                        if (!cameraResult.didCancel && cameraResult.assets && cameraResult.assets.length > 0) {
                            uploadAvatar(cameraResult.assets[0]);
                        }
                    },
                },
                {
                    text: 'Thư viện',
                    onPress: async () => {
                        // Mở Thư viện ảnh
                        const galleryResult = await launchImageLibrary({
                            mediaType: 'photo',
                            maxWidth: 500,
                            maxHeight: 500,
                            quality: 0.8,
                        });

                        if (!galleryResult.didCancel && galleryResult.assets && galleryResult.assets.length > 0) {
                            uploadAvatar(galleryResult.assets[0]);
                        }
                    },
                },
                { text: 'Huỷ', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };
    const uploadAvatar = async (asset: any) => {
        try {
            const file = {
                uri: asset.uri,
                type: asset.type,
                name: asset.fileName || 'avatar.jpg',
            };

            const payload = {
                token: user?.token,
                file: file
            };
            dispatch(showLoading())
            const result = await sendFileAPI(payload, 'it4788/change_info_after_signup');
            dispatch(hideLoading())
            if (result.code !== CODE_OK) {
                Alert.alert("Lỗi", result.message)
            } else {
                dispatch(setImage(result.data.avatar))
                setTextSuccess("Change Infor success!")
            }
        } catch (error) {
            console.error('Lỗi upload avatar:', error);
        }
    };
    const handleOkPress = () => {
        setTextSuccess('')
    }
    return (
        <View style={styles.container}>
            {/* Profile Card */}
            <View style={styles.profileCard}>
                <View style={styles.profileHeader}>
                    <Avatar.Image
                        // source={{ uri: user?.avatar }}
                        source={getAvatarUri(convertGoogleDriveLink(user?.avatar) as string)}
                        style={styles.profileImage}
                    />
                    <TouchableOpacity style={styles.editIcon} onPress={handleEditAvatar}>
                        <Icon name="edit" size={20} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>{`${user?.ho} ${user?.ten}`}</Text>
                        <Text style={styles.text}>SĐT: <Text style={styles.span}>Chưa có</Text></Text>
                        <Text style={styles.text}>Email: <Text style={styles.span}>{user?.email}</Text></Text>
                    </View>
                </View>
            </View>

            {/* Details Card */}
            <View style={styles.detailsCard}>
                <Divider style={styles.divider} />
                <View style={styles.row}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>
                        <Text style={styles.span}>{user?.email}</Text>
                    </Text>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.row}>
                    <Text style={styles.label}>Chức vụ:</Text>
                    <Text style={styles.value}>
                        <Text style={styles.span}>
                            {user?.role === Roles.STUDENT ? 'Học sinh' : user?.role === Roles.LECTURER ? 'Giảng viên' : 'Chưa có'}
                        </Text>
                    </Text>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.row}>
                    <Text style={styles.label}>Trạng thái:</Text>
                    <Text style={styles.value}>
                        <Text style={styles.span}>{user?.status}</Text>
                    </Text>
                </View>
            </View>
            <BaseModalSuccess
                title={textSuccess}
                isVisible={!!textSuccess}
                onOkPress={handleOkPress} // Truyền hàm vào prop này
            />
        </View>
    );
};

export default ProfileScreen;
