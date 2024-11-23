import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Avatar, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { Roles } from 'src/common/enum/commom';
import styles from './styles'
import { convertGoogleDriveLink, getAvatarUri } from 'src/utils/helper'
import { IUser } from 'src/interfaces/common.interface';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getUserInfor } from 'src/services/class.service';
import { CODE_OK } from 'src/common/constants/responseCode';
import { Alert } from 'react-native';
import { useAppDispatch } from 'src/redux';
import { hideLoading, showLoading } from 'src/redux/slices/loadingSlice';

const StudentProfile = () => {
    const [userProfile, setUserProfile] = useState<IUser | undefined>(undefined);
    const route: RouteProp<ClassNavigationType, 'GetStudentInfor'> = useRoute();
    const { account_id } = route.params;
    const dispatch = useAppDispatch()
    const auth = useSelector(selectAuth);
    const getUserProfile = async () => {
        try {
            dispatch(showLoading())
            const res = await getUserInfor({
                token: auth.user?.token,
                user_id: account_id
            })
            if (res.code !== CODE_OK) {
                Alert.alert("Lỗi", res.message)
            } else {
                setUserProfile(res.data)
            }
        } catch (error) {
            console.log(error);
        }finally {
            dispatch(hideLoading())
        }
    }
    useEffect(() => {
        getUserProfile()
    }, [])
    return (
        <View style={styles.container}>
            {/* Profile Card */}
            <View style={styles.profileCard}>
                <View style={styles.profileHeader}>
                    <Avatar.Image
                        // source={{ uri: user?.avatar }}
                        source={getAvatarUri(convertGoogleDriveLink(userProfile?.avatar) as string)}
                        style={styles.profileImage}
                    />

                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>{`${userProfile?.ho} ${userProfile?.ten}`}</Text>
                        <Text style={styles.text}>SĐT: <Text style={styles.span}>Chưa có</Text></Text>
                        <Text style={styles.text}>Email: <Text style={styles.span}>{userProfile?.email}</Text></Text>
                    </View>
                </View>
            </View>

            {/* Details Card */}
            <View style={styles.detailsCard}>
                <Divider style={styles.divider} />
                <View style={styles.row}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>
                        <Text style={styles.span}>{userProfile?.email}</Text>
                    </Text>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.row}>
                    <Text style={styles.label}>Chức vụ:</Text>
                    <Text style={styles.value}>
                        <Text style={styles.span}>
                            {userProfile?.role === Roles.STUDENT ? 'Học sinh' : userProfile?.role === Roles.LECTURER ? 'Giảng viên' : 'Chưa có'}
                        </Text>
                    </Text>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.row}>
                    <Text style={styles.label}>Trạng thái:</Text>
                    <Text style={styles.value}>
                        <Text style={styles.span}>{userProfile?.status}</Text>
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default StudentProfile;
