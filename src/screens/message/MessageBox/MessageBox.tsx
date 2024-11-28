import React, { useEffect, useState } from "react";
import 'text-encoder';
import 'fast-text-encoding';
import SockJS from "sockjs-client";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Client from "@stomp/stompjs"; // Importing StompClient
import MessageHeader from "src/screens/message/components/MessageHeader";
import { getConversationApi, IGetConversationsBody, IMessageResponse } from "src/services/message.services";

const MessageBox = ({ route, navigation }: any) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState<any>(null); // Stomp client state
    const { partnerId, userName, token, conversationId, receiverId, email, userId } = route.params;
    const [latestId, setLatestId] = useState<number>();
    const [loadingMore, setLoadingMore] = useState<boolean>(false);

    // Setup SockJS and StompClient connection
    useEffect(() => {
        const client = Client.Stomp.over(() => {
            return new SockJS("http://157.66.24.126:8080/ws");
        });

        client.connect({}, (frame: any) => {
            console.log("Connected: " + frame);

            client.subscribe(`/user/${partnerId}/inbox`, (message: any) => {
                const msg = JSON.parse(message.body);
                if (msg.sender.id !== userId) {
                    setLatestId(msg.id + 1);
                    setMessages((prevMessages) => [
                        { id: latestId, text: msg.content, sender: "their" },
                        ...prevMessages,
                    ]);
                }
            });

            // Fetch conversations when the client connects
            fetchConversations();
            setStompClient(client);
        });

        // Cleanup the connection when component unmounts
        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, [messages]);

    // Fetch conversations from the API
    const fetchConversations = async () => {
        const requestBody: IGetConversationsBody = {
            token,
            index: 0,
            count: 14,
            conversation_id: conversationId,
            mark_as_read: true,
        };

        try {
            const response = await getConversationApi(requestBody);

            if (response.meta?.code === "1000") {
                const fetchedMessages = response.data?.conversation.map((msg: IMessageResponse) => ({
                    id: Number(msg.message_id),
                    text: msg.message,
                    sender: msg.sender.id === userId ? "me" : "their"
                }));

                setMessages(fetchedMessages.reverse());
            } else {
                console.error("Failed to fetch messages:", response.meta?.message);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Send a message using StompClient
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
                { id: messages.length + 1, text: input, sender: "me" },
                ...messages,
            ]);
            setInput("");
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

    // Load more messages when scrolled to the top
    const loadMoreMessages = async () => {
        if (!loadingMore) {
            setLoadingMore(true);

            const requestBody: IGetConversationsBody = {
                token,
                index: messages.length, // Start loading from the last message
                count: 14,
                conversation_id: conversationId,
                mark_as_read: true,
            };

            try {
                const response = await getConversationApi(requestBody);

                if (response.meta?.code === "1000") {
                    const fetchedMessages = response.data?.conversation.map((msg: IMessageResponse) => ({
                        id: Number(msg.message_id),
                        text: msg.message,
                        sender: msg.sender.id === userId ? "me" : "their"
                    }));

                    setMessages((prevMessages) => [...fetchedMessages.reverse(), ...prevMessages]);
                } else {
                    console.error("Failed to fetch more messages:", response.meta?.message);
                }
            } catch (error) {
                console.error("Error loading more messages:", error);
            } finally {
                setLoadingMore(false);
            }
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
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMessage}
                    inverted // Inverts the scroll direction
                    contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                    keyboardShouldPersistTaps="handled"
                    onEndReached={loadMoreMessages} // Trigger load more on scroll to top
                    onEndReachedThreshold={0.1} // Start loading more when near top
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={input}
                        onChangeText={setInput}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Text style={styles.sendButtonText}>Send</Text>
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
