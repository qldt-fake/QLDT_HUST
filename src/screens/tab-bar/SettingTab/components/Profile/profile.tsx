import React from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { Avatar, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { Roles } from 'src/common/enum/commom';
import styles from './styles';
import { getAvatarUri } from 'src/utils/helper';

const ProfileScreen = () => {
    const auth = useSelector(selectAuth);
    const user = auth.user;

    // Giả sử các lớp học của người dùng có dạng sau:
    const classes = user?.class_list || [];

    return (
        <View style={styles.container}>
            {/* Profile Card */}
            <View style={styles.profileCard}>
                <View style={styles.profileHeader}>
                    <Avatar.Image
                        // source={{ uri: user?.avatar }}
                        source={getAvatarUri(user?.avatar as string)}
                        style={styles.profileImage}
                    />
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

            {/* Classes Card */}
            <View style={styles.classesCard}>
                {user?.role === Roles.LECTURER ?
                    <Text style={styles.cardTitle}>Các lớp đang giảng dạy</Text>
                    :
                    <Text style={styles.cardTitle}>Các lớp đang học</Text>
                }
                <Divider style={styles.divider} />
                <View style={styles.rowHeader}>
                    <Text style={[styles.columnHeader, styles.headerName]}>Tên</Text>
                    <Text style={[styles.columnHeader, styles.headerType]}>Loại</Text>
                    <Text style={[styles.columnHeader, styles.headerStatus]}>Trạng thái</Text>
                </View>
                <FlatList
                    data={classes}
                    keyExtractor={(item) => item.class_id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.class_row}>
                            <Text style={styles.text}>{item.class_name}</Text>
                            <Text style={styles.text}>{item.class_type}</Text>
                            <Text style={styles.text}>{item.status}</Text>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

export default ProfileScreen;
