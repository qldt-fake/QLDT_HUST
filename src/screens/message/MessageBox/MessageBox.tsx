import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Client from "@stomp/stompjs";
import "fast-text-encoding";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { getConversationApi, IGetConversationsBody, IMessageResponse } from "src/services/message.services";
import MessageHeader from "src/screens/message/components/MessageHeader";

const MessageBox = ({ route, navigation }: any) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState<any>(null); // Stomp client state
    const {userName, token, conversationId, receiverId, email, userId } = route.params;
    const [latestId, setLatestId] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);

    // Fetch conversations from the API
    const fetchConversations = async (loadMore = false) => {
        const requestBody: IGetConversationsBody = {
            token,
            index: loadMore ? messages.length : 0, // Start at the last message if loading more
            count: 20,
            conversation_id: conversationId,
            mark_as_read: true,
        };

        try {
            const response = await getConversationApi(requestBody);

            if (response.meta?.code === "1000") {
                const fetchedMessages = response.data?.conversation.map((msg: IMessageResponse) => ({
                    id: Number(msg.message_id),
                    text: msg.message,
                    sender: msg.sender.id == userId ? "me" : "their"
                }));

                setMessages((prevMessages) => {
                    if(loadMore) {
                        return [...prevMessages, ...fetchedMessages];
                    }
                    else{
                        setLatestId(fetchedMessages[0].id);
                        return fetchedMessages;
                    }
                });

                setHasMore(fetchedMessages.length === 20); // If less than PAGE_SIZE, no more messages to load
            } else {
                console.error("Failed to fetch messages:", response.meta?.message);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        const client = Client.Stomp.over(() => new SockJS("http://157.66.24.126:8080/ws"));

        client.connect({}, (frame: any) => {
            console.log("Connected: " + frame);
            client.subscribe(`/user/${receiverId}/inbox`, (message: any) => {
                const msg = JSON.parse(message.body);

                if (msg.sender.id != userId) {
                    setMessages((prevMessages) => [
                        { id: msg.id, text: msg.content, sender: "their" } , ...prevMessages
                    ]);
                    setLatestId(msg);
                }
            });

            fetchConversations();

            setStompClient(client);
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    const sendMessage = () => {
        if (input.trim() && stompClient) {
            const message = {
                receiver: { id: receiverId },
                content: input,
                sender: email, // Replace with the sender's name
                token: token,
            };

            console.log("Sending message:", message);
            stompClient.send("/chat/message", {}, JSON.stringify(message));

            setMessages([
                { id: latestId + 1, text: input, sender: "me" },
                ...messages,
            ]);
            setInput("");
            setLatestId(latestId + 1);
        }
    };

    const renderMessage = ({ item }: any) => (
        <View
            style={[
                styles.message,
                item.sender === "me" ? styles.myMessage : styles.theirMessage,
            ]}
        >
            <Text
                style={
                    item.sender === "me"
                        ? styles.myMessageText
                        : styles.theirMessageText
                }
            >
                {item.text}
            </Text>
        </View>
    );

    const loadMoreMessages = () => {
        if (hasMore) {
            fetchConversations(true);
        }
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => <MessageHeader user={{ name: userName, avatar: "" }} />,
        });
    }, [navigation]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.container}>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    inverted // Inverted to show latest messages at the bottom
                    contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                    keyboardShouldPersistTaps="handled"
                    onEndReached={loadMoreMessages} // Trigger loading more when scrolled to bottom
                    onEndReachedThreshold={0.5}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={input}
                        onChangeText={setInput}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Text style={styles.sendButtonText}>Gửi</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    message: {
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
        maxWidth: "70%",
    },
    myMessage: {
        backgroundColor: "#f43d3b",
        alignSelf: "flex-end",
    },
    theirMessage: {
        backgroundColor: "#f0f0f0",
        alignSelf: "flex-start",
    },
    myMessageText: {
        color: "#ffffff",
    },
    theirMessageText: {
        color: "#000000",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingBottom: 65,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        backgroundColor: "#fff",
    },
    input: {
        flex: 1,
        padding: 10,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 20,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: "#ff4d4d",
        padding: 10,
        borderRadius: 8,
    },
    sendButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default MessageBox;
