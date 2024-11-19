import React, { useEffect } from 'react';
import { View, Image, ScrollView, Text } from 'react-native';
import { Avatar, Divider } from 'react-native-paper';
import styles from './styles';
import { useSelector } from 'react-redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { convertGoogleDriveLink, getAvatarUri } from 'src/utils/helper';
import { Roles } from 'src/common/enum/commom';
const ProfileScreen = () => {
    const auth = useSelector(selectAuth)
    const user = auth.user
    
    return (
        <ScrollView style={styles.container}>
            {/* Profile Card */}
            <View style={styles.profileCard}>
                <View style={styles.profileHeader}>
                    <Avatar.Image
                        source={getAvatarUri(convertGoogleDriveLink(user?.avatar) as string)}
                        style={styles.profileImage}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>{`${user?.ho} ${user?.ten}`}</Text>
                        <Text style={styles.text}>
                            SĐT: <Text style={styles.span}>Chưa có</Text>
                        </Text>
                        <Text style={styles.text}>
                            Email: <Text style={styles.span}>{user?.name}</Text>
                        </Text>
                    </View>
                </View>
            </View>

            {/* Details Card */}
            <View style={styles.detailsCard}>
                {/* <View style={styles.row}>
                    <Text style={styles.label}>UserName:</Text>
                    <Text style={styles.value}>
                        <Text style={styles.span}>{user?.username}</Text>
                    </Text>
                </View> */}
                <Divider style={styles.divider} />
                <View style={styles.row}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>
                        <Text style={styles.span}>{user?.email}</Text>
                    </Text>
                </View>
                <Divider style={styles.divider} />
                {/* Faculty/School Row */}
                <View style={styles.row}>
                    <Text style={styles.label}>Chức vụ:</Text>
                    <Text style={styles.value}>
                        <Text style={styles.span}>{user?.role === Roles.STUDENT ? `Học sinh` : Roles.LECTURER ? `Giảng viên` : 'Chưa có'}</Text>
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
        </ScrollView>
    );
};

export default ProfileScreen;
