import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationDetail = ({ route }: any) => {
    const { title, content, date } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.content}>{content}</Text>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    content: {
        fontSize: 16,
        marginBottom: 20,
    },
    location: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#007bff',
    },
});

export default NotificationDetail;
