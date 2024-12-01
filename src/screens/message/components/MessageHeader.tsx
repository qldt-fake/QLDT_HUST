import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import {convertGoogleDriveLink, getAvatarUri} from "src/utils/helper";

const MessageHeader = ({ user }: { user: { name: string; avatar: string } }) => {
    return (
        <View style={styles.headerContainer}>
                <Avatar.Image source={getAvatarUri(convertGoogleDriveLink(user.avatar != null? user.avatar : "") as string)} size={45}/>

            <Text style={styles.userName}>{user.name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    placeholderAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ccc",
        marginRight: 10,
    },
    userName: {
        paddingLeft: 8,
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default MessageHeader;
