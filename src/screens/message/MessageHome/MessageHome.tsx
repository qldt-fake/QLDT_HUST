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
    const [accountPage, setAccountPage] = useState(0);
    const [hasMoreAccounts, setHasMoreAccounts] = useState(true); // Có thêm dữ liệu không
    const [isSearching, setIsSearching] = useState(false);

    const auth = useSelector(selectAuth);
    const user = auth.user;

    useEffect(() => {
        fetchConversations(0); // Load initial conversations
    }, []);

    const fetchConversations = async (index: number) => {
        setLoading(true);
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
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    const searchAccounts = async (page: number) => {
        if (searchText.trim() === "") {
            setIsSearching(false);
            return;
        }
        if (!hasMoreAccounts && page !== 0) return;
        setLoading(true);
        setIsSearching(true);
        try {
            const response = await searchAccount({
                search: searchText,
                pageable_request: {
                    page,
                    page_size: 15,
                },
            });
            if (response.meta.code === "1000") {
                const newAccounts: IAccount[] = response.data.page_content.map((item: any) => ({
                    account_id: item.id,
                    first_name: item.first_name,
                    last_name: item.last_name,
                    email: item.email,
                }));
                setAccounts((prev) => (page === 0 ? newAccounts : [...prev, ...newAccounts]));
                setHasMoreAccounts(response.data.page_content.length > 0); // Kiểm tra nếu có thêm dữ liệu
                setAccountPage(page);
            }
        } catch (error) {
            console.error("Error searching accounts:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderAccount = ({ item }: { item: IAccount }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() =>
                navigation.navigate(AppNaviagtionName.MessageNavigation, {
                    screen: MessageNavigationName.MessageBox,
                    params: { userId: item.account_id, username: item.first_name + ' ' + item.last_name },
                })
            }
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
                        setAccountPage(0);
                        setHasMoreAccounts(true);
                    }}
                />
                <TouchableOpacity
                    style={styles.searchIcon}
                    onPress={() => searchAccounts(0)} // Bắt đầu tìm kiếm
                >
                    <Icon name="search" size={20} color="#333" />
                </TouchableOpacity>
            </View>
            {isSearching ? (
                <FlatList
                    data={accounts}
                    keyExtractor={(item) => item.account_id}
                    renderItem={renderAccount}
                    onEndReached={() => searchAccounts(accountPage + 1)} // Tải thêm dữ liệu
                    onEndReachedThreshold={0.5}
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
                            style={styles.userItem}
                            onPress={() => {
                                console.log(item.id)
                                navigation.navigate(AppNaviagtionName.MessageNavigation, {
                                    screen: MessageNavigationName.MessageBox,
                                    params: {email: user?.email, userId: user?.id, partnerId: item.partner.id, userName: item.partner.name, conversationId: item.id, token: user?.token, receiverId: item.partner.id },
                                })
                            }
                            }
                        >
                            <Text style={styles.name}>{item.partner.name}</Text>
                            <Text style={styles.message}>{item.last_message.message}</Text>
                        </TouchableOpacity>
                    )}
                    // onEndReached={() => fetchConversations(accountPage + 1)}
                    onEndReachedThreshold={0.5}
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
    userItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    name: { fontSize: 16, fontWeight: "bold" },
    email: { fontSize: 14, color: "#555" },
    message: { fontSize: 14, color: "#777" },
});

export default MessageHome;
