import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {getListConversationsApi, IConversation,} from "src/services/message.services";
import {AppNaviagtionName, MessageNavigationName} from "src/common/constants/nameScreen";
import {useSelector} from "react-redux";
import {logout, selectAuth} from "src/redux/slices/authSlice";
import {searchAccount} from "src/services/class.service";

import FCMService from "src/services/FCMService";
import {FCMEnum} from "src/common/enum/FCMEnum";
import {Avatar} from "react-native-paper";
import {convertGoogleDriveLink, getAvatarUri} from "src/utils/helper";
import {white} from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import {number} from "yup";
import {INVALID_TOKEN} from "src/common/constants/responseCode";
import {useAppDispatch} from "src/redux";

interface IAccount {
    account_id: string;
    last_name: string;
    first_name: string;
    email: string;
    avatar: string;
}

const MessageHome: React.FC = () => {
    const navigation: NavigationProp<any> = useNavigation();
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [, setAccountPage] = useState<number>(0);
    const [, setIndex] = useState(0);
    const [hasMoreAccounts, setHasMoreAccounts] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [hasMoreConversation, setHasMoreConversation] = useState(true);
    const auth = useSelector(selectAuth);
    const user = auth.user;
    const dispatch = useAppDispatch();
    const [refreshing, setRefreshing] = useState(false);
    let onEndReachedCalledDuringMomentum = true;
    const fetch = (notificationPartnerId: any, message: any, isUnread: any) => {
        setConversations((prevConversations) => {
            const updatedConversations = [...prevConversations];
            console.log(prevConversations[0].partner.id + "test");
            const index = updatedConversations.findIndex(
                (conversation) => conversation.partner.id === Number(notificationPartnerId)
            );
            if (index !== -1) {
                const updatedConversation = {
                    ...updatedConversations[index],
                    last_message: {
                        ...updatedConversations[index].last_message,
                        message: message,
                        unread: isUnread, // đánh dấu tin nhắn chưa đọc
                    },
                };
                updatedConversations.splice(index, 1); // Xóa vị trí cũ
                return [updatedConversation, ...updatedConversations]; // Đưa lên đầu
            } else {
                fetchConversations(0, 1);
                return prevConversations;
            }
        });
    }
    useEffect(() => {
        const handleNotification = async (data: any) => {
            if (data.data.type === FCMEnum.MESSAGE) {
                const notificationPartnerId = data.data.id;
                fetch(notificationPartnerId, data.notification.body, 1);

            }
        };

        FCMService.getInstance().on('newNotification', handleNotification);

        setIndex(() => {
            fetchConversations(0, 15);
            return 0;
        });

        return () => {
            FCMService.getInstance().off('newNotification', handleNotification);
        };
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true); // Bật trạng thái làm mới
        try {
            setIndex(() => {
                fetchConversations(0, 15);
                return 0;
            })
           // Fetch lại dữ liệu từ đầu
        } catch (error) {
            console.error("Error refreshing conversations:", error);
        } finally {
            setRefreshing(false); // Tắt trạng thái làm mới
        }
    };
    const fetchConversations = async (index: number, count: any) => {
        setLoading(true);
        if (!hasMoreConversation && index != 0)
            return;
        try {
            const response = await getListConversationsApi({
                token: user?.token ?? "",
                index: index * 15,
                count: count,
            });
            if (response.meta.code === "1000") {
                const {conversations: newConversations} = response.data;
                setConversations((prev) => {
                        if (count === 1) {
                            return [...newConversations, ...prev];
                        } else  return  index === 0 ? newConversations : [...prev, ...newConversations];
                    }
                );
                setHasMoreConversation(newConversations.length > 0)
            } else if( response.meta.code === INVALID_TOKEN){
                Alert.alert('Lỗi', 'Token không hợp lệ');
                dispatch(logout());
            }
        } catch (error) {
            Alert.alert('Không có kết nối');
        } finally {
            setLoading(false);
        }
    };

    const searchAccounts = async (accountPage: number) => {
        if (searchText.trim() === "") {
            setIsSearching(false);
            return;
        }

        if (!hasMoreAccounts && accountPage !== 0) return;

        setLoading(true);
        setIsSearching(true);
        try {
            const response = await searchAccount({
                search: searchText,
                pageable_request: {
                    page: accountPage,
                    page_size: 15,
                },
            });
            if (response.meta.code === "1000") {
                const newAccounts: IAccount[] = response.data.page_content.map((item: any) => ({
                    account_id: item.account_id,
                    first_name: item.first_name,
                    last_name: item.last_name,
                    email: item.email,
                    avatar: item.avatar,
                }));
                setAccounts((prev) => (accountPage === 0 ? newAccounts : [...prev, ...newAccounts]));
                setHasMoreAccounts(response.data.page_content.length == 15);
            }else if( response.meta.code === INVALID_TOKEN){
                Alert.alert('Lỗi', 'Token không hợp lệ');
                dispatch(logout());
            }
        } catch (error) {
            console.error("Error searching accounts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSearch = () => {
        setIsSearching(false);
        setSearchText("");
        setAccounts([]);
    };

    const renderAccount = ({item}: { item: IAccount }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => {
                handleCancelSearch();
                navigation.navigate(AppNaviagtionName.MessageNavigation, {
                    screen: MessageNavigationName.MessageBox,
                    params: {
                        email: user?.email,
                        userId: user?.id,
                        userName: `${item.first_name} ${item.last_name}`,
                        token: user?.token,
                        receiverId: item.account_id,
                        conversationId: null,
                        avatar: item.avatar,
                        fetch: fetch
                    },
                });
            }}
        >
            <Avatar.Image
                source={getAvatarUri(convertGoogleDriveLink(item.avatar != null ? item.avatar : "") as string)}
                size={40}
            />
            <View style={{marginLeft: 10}}>
                <Text style={styles.name}>{`${item.first_name} ${item.last_name}`}</Text>
                <Text style={styles.email}>{item.email}</Text>
            </View>
        </TouchableOpacity>
    );


    // @ts-ignore
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    value={searchText}
                    onChangeText={(text) => {
                        setSearchText(text);
                        setHasMoreAccounts(true);
                    }}
                />
                <TouchableOpacity
                    style={styles.searchIcon}
                    onPress={() => {
                        setAccounts([]);
                        setAccountPage(() => {
                            searchAccounts(0)
                            return 1;
                        })
                    }}
                >
                    <Icon name="search" size={20} color="#333"/>
                </TouchableOpacity>
                {isSearching && (
                    <TouchableOpacity style={styles.cancelIcon} onPress={handleCancelSearch}>
                        <Text style={styles.cancelText}>Hủy</Text>
                    </TouchableOpacity>
                )}
            </View>
            {isSearching ? (
                <FlatList
                    data={accounts}
                    keyExtractor={(item) => item.account_id}
                    renderItem={renderAccount}
                    onMomentumScrollBegin={() => {
                        onEndReachedCalledDuringMomentum = false;
                    }}
                    onEndReached={() => {
                        if (!onEndReachedCalledDuringMomentum) {
                            if (hasMoreAccounts)
                                setAccountPage((prevPage) => {
                                    searchAccounts(prevPage);
                                    return prevPage + 1;
                                });
                            onEndReachedCalledDuringMomentum = true;
                        }
                    }}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={
                        loading ? <ActivityIndicator size="small" color="#0000ff"/> : null
                    }
                />
            ) : (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={styles.userItem}
                            onPress={() => {
                                navigation.navigate(AppNaviagtionName.MessageNavigation, {
                                    screen: MessageNavigationName.MessageBox,
                                    params: {
                                        email: user?.email,
                                        userId: user?.id,
                                        userName: item.partner.name,
                                        conversationId: item.id,
                                        token: user?.token,
                                        receiverId: item.partner.id,
                                        avatar: item.partner.avatar,
                                        markAsRead: () => {
                                            setConversations((prevMessages) =>
                                                prevMessages.map((msg) =>
                                                    msg.id === item.id
                                                        ? {
                                                            ...msg,
                                                            last_message: {
                                                                ...msg.last_message,
                                                                unread: 0,
                                                            },
                                                        }
                                                        : msg
                                                )
                                            );
                                        },
                                        updateLastMessages: (lastMessage: string) => {
                                            setConversations((prevMessages) => {
                                                // Cập nhật nội dung phần tử
                                                const updatedMessages = prevMessages.map((msg) =>
                                                    msg.id === item.id
                                                        ? {
                                                            ...msg,
                                                            last_message: {
                                                                ...msg.last_message,
                                                                message: lastMessage,
                                                            },
                                                        }
                                                        : msg
                                                );


                                                const updatedAndSortedMessages = updatedMessages.sort((a, b) =>
                                                    a.id === item.id ? -1 : b.id === item.id ? 1 : 0
                                                );
                                                return updatedAndSortedMessages;
                                            });
                                        }

                                    },

                                });
                            }}
                        >
                            <View style={styles.conversationContainer}>
                                <Avatar.Image
                                    source={getAvatarUri(convertGoogleDriveLink(item.partner.avatar != null ? item.partner.avatar : "") as string)} // URL của avatar
                                    size={40}
                                />
                                <View style={styles.conversationText}>
                                    <Text style={styles.name}>{item.partner.name}</Text>
                                    <Text
                                        style={[styles.message, (item.last_message.unread == 1 && item.last_message.sender.id.toString() != user?.id) && styles.unreadMessage]}>
                                        {item.last_message.message != null ? item.last_message.message : "Tin nhắn đã bị thu hồi"}
                                    </Text>
                                </View>
                                {(item.last_message.unread == 1 && item.last_message.sender.id.toString() != user?.id) &&
                                    <View style={styles.unreadDot}/>}
                            </View>
                        </TouchableOpacity>
                    )}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => {
                        onEndReachedCalledDuringMomentum = false;
                    }}
                    onEndReached={() => {
                        if (!onEndReachedCalledDuringMomentum) {
                            if (hasMoreConversation)
                                setIndex(prevState => {
                                    fetchConversations(prevState, 15);
                                    return prevState + 1;
                                })
                            onEndReachedCalledDuringMomentum = true;
                        }
                    }}
                    ListFooterComponent={
                        loading ? <ActivityIndicator size="small" color="#0000ff"/> : null
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh} // Gọi hàm làm mới khi kéo xuống
                        />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f4f5f7",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 5,
        paddingHorizontal: 10,
        color: "#333",
    },
    searchIcon: {
        backgroundColor: "#ffffff",
        borderRadius: 8,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    cancelIcon: {
        marginLeft: 10,
    },
    cancelText: {
        fontSize: 14,
        color: "red",
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 10,
    },
    avatar: {
        marginRight: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    email: {
        fontSize: 14,
        color: "#777",
    },
    conversationContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 10,
    },
    conversationText: {
        flex: 1,
        marginLeft: 15,
    },
    message: {
        fontSize: 14,
        color: "#666",
    },
    unreadMessage: {
        fontWeight: "bold",
        color: "#333",
    },
    unreadDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "red",
    },
    footer: {
        marginVertical: 10,
    },
});


export default MessageHome;
