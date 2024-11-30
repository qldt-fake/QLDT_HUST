import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface CustomHeaderProps {
    user: {
        name: string;
        avatar: string;
    };
}

const MessageHeader: React.FC<CustomHeaderProps> = ({ user }) => {
    return (
        <View style={styles.headerContainer}>
            {/*<Image*/}
            {/*    source={{ uri: user.avatar }}*/}
            {/*    style={styles.avatar}*/}
            {/*/>*/}
            <Text style={styles.headerText}>{user.name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default MessageHeader;
