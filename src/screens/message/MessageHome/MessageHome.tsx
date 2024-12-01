import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
    getListConversationsApi,
    IConversation,
} from "src/services/message.services";
import { AppNaviagtionName, MessageNavigationName } from "src/common/constants/nameScreen";
import { useSelector } from "react-redux";
import { selectAuth } from "src/redux/slices/authSlice";
import { searchAccount } from "src/services/class.service";
import {FCMEnum} from "src/utils/FCMEnum";
import FCMService from "src/services/FCMService";

interface IAccount {
    account_id: string;
    last_name: string;
    first_name: string;
    email: string;
}

const MessageHome: React.FC = () => {
    const navigation: NavigationProp<any> = useNavigation();
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [, setAccountPage] = useState<number>(0);
    const [,setIndex] = useState(0);
    const [hasMoreAccounts, setHasMoreAccounts] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [hasMoreConversation, setHasMoreConversation] = useState(true);
    const auth = useSelector(selectAuth);
    const user = auth.user;
    let onEndReachedCalledDuringMomentum = true;

    useEffect(() => {
        const handleNotification = async (data: any) => {
            if (data.data.type === FCMEnum.MESSAGE) {
                fetchConversations(0);
            }
        }
        FCMService.getInstance().on('newNotification', handleNotification);
        const unsubscribe = navigation.addListener("focus", () => {
            setIndex(() => {
               fetchConversations(0);
               return 0;
            });
        });
        return unsubscribe;
    }, [navigation]);

    const fetchConversations = async (index: number) => {
        setLoading(true);
        if(!hasMoreConversation&&index!=0)
             return;
        try {
            const response = await getListConversationsApi({
                token: user?.token ?? "",
                index,
                count: 10,
            });
            if (response.meta.code === "1000") {
                const { conversations: newConversations } = response.data;
                setConversations((prev) =>
                    index === 0 ? newConversations : [...prev, ...newConversations]
                );
                setHasMoreConversation(newConversations.length > 0)
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
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
                }));
                setAccounts((prev) => (accountPage === 0 ? newAccounts : [...prev, ...newAccounts]));
                setHasMoreAccounts(response.data.page_content.length == 15);
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

    const renderAccount = ({ item }: { item: IAccount }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => {
                handleCancelSearch(); // Hủy tìm kiếm trước khi navigate
                navigation.navigate(AppNaviagtionName.MessageNavigation, {
                    screen: MessageNavigationName.MessageBox,
                    params: {
                        email: user?.email,
                        userId: user?.id,
                        userName: `${item.first_name} ${item.last_name}`,
                        token: user?.token,
                        receiverId: item.account_id,
                        conversationId: null,
                    },
                });
            }}
        >
            <Text style={styles.name}>{`${item.first_name} ${item.last_name}`}</Text>
            <Text style={styles.email}>{item.email}</Text>
        </TouchableOpacity>
    );

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
                    <Icon name="search" size={20} color="#333" />
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
                            setAccountPage((prevPage) => {
                                searchAccounts(prevPage);
                                return prevPage+1;
                            });
                            onEndReachedCalledDuringMomentum = true;
                        }
                    }}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={
                        loading ? <ActivityIndicator size="small" color="#0000ff" /> : null
                    }
                />
            ) : (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={((item.last_message.unread!==0)&&(item.last_message.sender.id.toString()!==user?.id))?styles.unreadUserItem:styles.userItem}
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
                                    },
                                });
                            }}
                        >
                            <Text style={styles.name}>{item.partner.name}</Text>
                            <Text style={styles.message}>{item.last_message.message}</Text>
                        </TouchableOpacity>
                    )}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => {
                        onEndReachedCalledDuringMomentum = false;
                    }}
                    onEndReached={() => {
                        if (!onEndReachedCalledDuringMomentum) {
                            setIndex(prevState => {
                                fetchConversations(prevState);
                                return prevState+1;
                            })
                            onEndReachedCalledDuringMomentum = true;
                        }
                    }}
                    ListFooterComponent={
                        loading ? <ActivityIndicator size="small" color="#0000ff" /> : null
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#fff" },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginLeft: 10,
        padding: 10,
    },
    cancelIcon: {
        marginLeft: 10,
        padding: 10,
    },
    cancelText: {
        fontSize: 16,
        color: "red",
    },
    unreadUserItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        backgroundColor: "#da9898",
    },
    userItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    name: { fontSize: 18, fontWeight: "bold" },
    email: { fontSize: 16, color: "#000000" },
    message: { fontSize: 16, color: "#000000" },
});

export default MessageHome;
