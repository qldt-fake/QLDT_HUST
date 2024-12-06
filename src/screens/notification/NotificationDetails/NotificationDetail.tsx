import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const NotificationDetail = ({route, navigation}: any) => {
    const {title, content} = route.params;
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Thông báo",
            headerTitleAlign: "center", // Căn giữa tiêu đề
            headerStyle: {
                backgroundColor: "#8B0000", // Màu đỏ đô
            },
            headerTitleStyle: {
                color: "#FFFFFF", // Màu trắng
                fontWeight: "bold", // In đậm
                fontSize: 22, // Kích thước lớn hơn
            },
            headerTintColor: "#FFFFFF", // Đặt màu mũi tên navigate back là trắng
        });
    }, [navigation]);


    return (
        <View style={styles.container}>
            <ScrollView style={styles.contentContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.content}>{content}</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        backgroundColor: '#B71C1C',
        paddingVertical: 15,
        alignItems: 'center'
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    contentContainer: {
        paddingHorizontal: 15,
        paddingTop: 20
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    content: {
        fontSize: 16,
        lineHeight: 24
    }
});

export default NotificationDetail;
