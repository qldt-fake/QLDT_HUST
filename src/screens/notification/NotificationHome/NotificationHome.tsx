import React, { useEffect, useState } from 'react';
import {View, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import NotificationBox from "src/screens/notification/components/NotificationBox/NotificationBox";
import {NavigationProp, useNavigation} from "@react-navigation/native";

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
    const navigation: NavigationProp<NotificationNavigationType> = useNavigation();
    const markAsRead = (id: string) => {
        const updatedNotifications = notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
        );
        setNotifications(updatedNotifications);
        const selectedNotification = updatedNotifications.find(notification => notification.id === id);
        if (selectedNotification) {
            navigation.navigate('NotificationDetail', {
                title: selectedNotification.title,
                content: selectedNotification.content,
            });
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
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => markAsRead(item.id)}>
                        <NotificationBox
                            title={item.title}
                            content={item.content}
                            date={item.date}
                            read={item.read}
                        />
                    </TouchableOpacity>
                )}
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
});

export default NotificationHome;
