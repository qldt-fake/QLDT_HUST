import React, {useCallback, useEffect, useState} from "react";
import SockJS from "sockjs-client";
import Client from "@stomp/stompjs";
import "fast-text-encoding";

import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {
    getConversationApi,
    deleteMessageApi,
    IGetConversationsBody,
    IMessageResponse
} from "src/services/message.services";
import MessageHeader from "src/screens/message/components/MessageHeader";
import {useAppDispatch} from "src/redux";
import {logout} from "src/redux/slices/authSlice";
import {INVALID_TOKEN} from "src/common/constants/responseCode";

const MessageBox = ({route, navigation,}: any) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState<any>(null); // Stomp client state
    let {
        userName,
        token,
        conversationId,
        receiverId,
        email,
        userId,
        avatar,
        markAsRead,
        fetch,
        getConversationId

    } = route.params;
    const [, setLatestId] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [, setIndex] = useState(0);
    const dispatch = useAppDispatch();
    const [conId, setConId] = useState<Number>(-1);
    // Fetch conversations from the API
    let onEndReachedCalledDuringMomentum = false
    const fetchConversations = async (index: number) => {
        if (!hasMore || conversationId === null)
            return;
        const requestBody: IGetConversationsBody = {
            token,
            index: index * 20, // Start at the last message if loading more
            count: 20,
            conversation_id: conversationId,
            mark_as_read: true,
        };
        setLoading(true);
        try {
            const response = await getConversationApi(requestBody);

            if (response.meta?.code === "1000") {
                const fetchedMessages = response.data?.conversation.map((msg: IMessageResponse) => ({
                    id: Number(msg.message_id),
                    text: msg.message,
                    sender: msg.sender.id == userId ? "me" : "their"
                }));

                setMessages((prevMessages) => {
                    setLoading(false);
                    if (index != 0) {
                        return [...prevMessages, ...fetchedMessages];
                    } else {
                        setLatestId(fetchedMessages[0].id);
                        return fetchedMessages;
                    }
                });
                setHasMore(fetchedMessages.length > 0);

            } else if (response.meta.code === INVALID_TOKEN) {
                Alert.alert('Lỗi', 'Token không hợp lệ');
                dispatch(logout());
            }
        } catch (error) {
            console.log("hi");
        } finally {

        }
    };
    useEffect(() => {
        const client = Client.Stomp.over(() => new SockJS("http://157.66.24.126:8080/ws"));

        client.connect({}, (frame: any) => {
            console.log("Connected: " + frame);
            client.subscribe(`/user/${receiverId}/inbox`, (message: any) => {
                const msg = JSON.parse(message.body);

                setMessages((prevMessages) => {
                    if (msg.sender.id.toString() === userId) fetch(receiverId, msg.content, 0);
                    return [
                        {
                            id: msg.id,
                            text: msg.content,
                            sender: (msg.sender.id.toString() === userId ? "me" : "their")
                        }, ...prevMessages
                    ];
                });
            });

        });
        setStompClient(client);
        if (conversationId != null) {
            setIndex(prevState => {
                fetchConversations(prevState);
                return prevState + 1;
            })
            setConId(conversationId);
        }

        return () => {
            markAsRead();
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const sendMessage = async () => {
        if (input.trim() && stompClient) {
            const message = {
                receiver: {id: receiverId},
                content: input,
                sender: email, // Replace with the sender's name
                token: token,
            };


            console.log("Sending message:", message);
            await stompClient.send("/chat/message", {}, JSON.stringify(message));
            setInput("");
            if (conId === -1 || conId === null) {
                await delay(500);
                getConversationId(receiverId).then((e: React.SetStateAction<Number>) => setConId(e));
            }


        }
    };

    const unSendMessage = async (messageId: any) => {
        try {
            const response = await deleteMessageApi({token, message_id: messageId, conversation_id: conId});
            if (response.meta?.code === "1000") {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === messageId
                            ? {...msg, text: null}
                            : msg
                    )
                );
                fetch(receiverId, "Tin nhắn đã bị gỡ");
            } else if (response.meta.code === INVALID_TOKEN) {
                Alert.alert('Lỗi', 'Token không hợp lệ');
                dispatch(logout());
            }
        } catch (error) {
            Alert.alert('Có lỗi khi gỡ tin nhắn');
        }
    };


    const handleLongPress = (messageId: string) => {
        Alert.alert(
            "Gỡ Tin Nhắn",
            "Bạn có chắc chắn muốn gỡ tin nhắn này không?",
            [
                {text: "Hủy", style: "cancel"},
                {text: "Gỡ", style: "destructive", onPress: () => unSendMessage(messageId)},
            ]
        );
    };


    const renderMessage = ({item}: any) => (
        <TouchableWithoutFeedback
            onLongPress={() => handleLongPress(item.id)}
        >
            <View
                style={[
                    styles.message,
                    item.sender === "me"
                        ? styles.myMessage
                        : styles.theirMessage,
                    item.text == null && styles.deletedMessage, // Áp dụng style nếu đã gỡ
                ]}
            >
                <Text
                    style={
                        item.text == null
                            ? styles.deletedMessageText // Style đặc biệt cho tin nhắn đã gỡ
                            : item.sender === "me"
                                ? styles.myMessageText
                                : styles.theirMessageText
                    }
                >
                    {item.text != null ? item.text : "Tin nhắn đã bị gỡ"}
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );


    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => <MessageHeader user={{name: userName, avatar: avatar}}/>,
        });
    }, [navigation]);

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.container}>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    inverted
                    contentContainerStyle={{flexGrow: 1, padding: 10}}
                    keyboardShouldPersistTaps="handled"
                    onMomentumScrollBegin={() => {
                        onEndReachedCalledDuringMomentum = false;
                    }}
                    onEndReached={() => {
                        if (!onEndReachedCalledDuringMomentum) {
                            setIndex(prevState => {
                                fetchConversations(prevState);
                                return prevState + 1;
                            });
                            onEndReachedCalledDuringMomentum = false;
                        }
                    }}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={
                        loading ? <ActivityIndicator size="small" color="#0000ff"/> : null
                    }
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
    )
        ;
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
    deletedMessage: {
        backgroundColor: "#e6e6e6", // Màu xám
        alignSelf: "flex-end",

    },
    deletedMessageText: {
        color: "#a0a0a0",
        fontStyle: "italic",
        textAlign: "right"
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
