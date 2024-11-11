import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Button, Text } from 'react-native';
import NotificationBox from "src/screens/notification/components/NotificationBox/NotificationBox";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppNaviagtionName, NotificationNavigationName } from "src/common/constants/nameScreen";
import Icon from 'react-native-vector-icons/MaterialIcons';

type Notification = {
    id: string;
    title: string;
    content: string;
    date: string;
    read: boolean;
}

const NotificationHome: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectMode, setSelectMode] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const navigation: NavigationProp<any> = useNavigation();

    const markAsRead = (id: string) => {
        const updatedNotifications = notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
        );
        setNotifications(updatedNotifications);
    };

    const markSelectedAsRead = () => {
        const updatedNotifications = notifications.map((notification) =>
            selectedIds.includes(notification.id) ? { ...notification, read: true } : notification
        );
        setNotifications(updatedNotifications);
        setSelectMode(false);
        setSelectedIds([]);
    };

    const handleSelectNotification = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const loadNotifications = () => {
        try {
            const sampleData = require('sampledata/notification.json');
            setNotifications(sampleData);
            setLoading(false);
        } catch (error) {
            console.error('Error loading notifications:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Thông báo</Text>
                <TouchableOpacity onPress={() => setSelectMode(!selectMode)}>
                    <Icon name="more-vert" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {selectMode && (
                <View style={styles.selectModeActions}>
                    <Button title="Đánh dấu đã đọc" onPress={markSelectedAsRead} />
                    <Button title="Hủy" onPress={() => setSelectMode(false)} />
                </View>
            )}

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                        <TouchableOpacity
                            style={[
                                styles.notificationItem,
                                isSelected && styles.selectedNotification,
                            ]}
                            onPress={() => {
                                if (selectMode) {
                                    handleSelectNotification(item.id);
                                } else {
                                    markAsRead(item.id);
                                    navigation.navigate(AppNaviagtionName.NotificationNavigation, {
                                        screen: NotificationNavigationName.NotificationDetail,
                                        params: {
                                            title: item.title,
                                            content: item.content,
                                        },
                                    });
                                }
                            }}
                            onLongPress={() => setSelectMode(true)}
                        >
                            <NotificationBox
                                title={item.title}
                                content={item.content}
                                date={item.date}
                                read={item.read}
                            />
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectModeActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    notificationItem: {
        marginVertical: 5,
        borderRadius: 8,
        overflow: 'hidden',
    },
    selectedNotification: {
        backgroundColor: '#d3d3d3', // Màu tối hơn cho thông báo được chọn
    },
});

export default NotificationHome;
