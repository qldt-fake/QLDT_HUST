import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {convertGoogleDriveLink, getAvatarUri} from "src/utils/helper";
const NotificationDetail = ({route, navigation}: any) => {
    const {title, content, image} = route.params;
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: {
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
            }
        });
    }, [navigation]);


    return (
        <View style={styles.container}>
            <ScrollView style={styles.contentContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.content}>{content}</Text>
                {image && (
                    <Image
                        source={getAvatarUri(convertGoogleDriveLink(image) as string)}
                        style={styles.image}
                        resizeMode="contain"
                    />
                )}
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
    image: {
        width: "100%", // Chiều rộng 100% container
        height: 200,   // Chiều cao cố định
        borderRadius: 8, // Bo góc ảnh
        marginTop: 16, // Khoảng cách từ phần nội dung
    },
    content: {
        fontSize: 16,
        lineHeight: 24
    }
});

export default NotificationDetail;
