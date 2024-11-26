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
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
    getConversationsApi,
    IConversation,
} from "src/services/message.services";
import { AppNaviagtionName, MessageNavigationName } from "src/common/constants/nameScreen";
import {useSelector} from "react-redux";
import {selectAuth} from "src/redux/slices/authSlice";
import {searchAccount} from "src/services/class.service";
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
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(10);

    const auth = useSelector(selectAuth);
    const user = auth.user;
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchConversations(0); // Load initial conversations
    }, []);

    const fetchConversations = async (index: number) => {
        setLoading(true);
        if(user != null)
        try {
            const response = await getConversationsApi({
                token: user.token,
                index: index,
                count: 2,
            });

            if (response.code === 1000) {
                const { conversations: newConversations } = response.data;
                setConversations((prev) =>
                    index === 0 ? newConversations : [...prev, ...newConversations]
                );
                setPage(index);
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    const searchAccounts = async () => {
        if (searchText.trim() === "") {
            setIsSearching(false);
            return;
        }
        setLoading(true);
        setIsSearching(true);
        try {
            const response = await searchAccount({
                search: searchText,
                pageable_request: {
                    page: 0,
                    page_size: 10,
                },
            });

            if (response.code === "1000") {
                setAccounts(response.data.page_content);
            }
        } catch (error) {
            console.error("Error searching accounts:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderConversation = ({ item }: { item: IConversation }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() =>
                navigation.navigate(AppNaviagtionName.MessageNavigation, {
                    screen: MessageNavigationName.MessageBox,
                    params: { conversationId: item.id },
                })
            }
        >
            <Text style={styles.name}>{item.partner.name}</Text>
            <Text style={styles.message}>{item.last_message.message}</Text>
        </TouchableOpacity>
    );

    const renderAccount = ({ item }: { item: IAccount }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => {
                // Handle navigating to a new conversation with this user
                console.log("Selected user:", item);
            }}
        >
            <Text style={styles.name}>{`${item.first_name} ${item.last_name}`}</Text>
            <Text style={styles.email}>{item.email}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search users..."
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={searchAccounts}
            />
            {isSearching ? (
                <FlatList
                    data={accounts}
                    keyExtractor={(item) => item.account_id}
                    renderItem={renderAccount}
                    // ListEmptyComponent={
                    //     !loading && <Text style={styles.emptyText}>No users found</Text>
                    // }
                />
            ) : (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderConversation}
                    onEndReached={() => fetchConversations(page + 1)}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loading && <ActivityIndicator size="small" color="#0000ff" />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#fff" },
    searchInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    userItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    name: { fontSize: 16, fontWeight: "bold" },
    email: { fontSize: 14, color: "#555" },
    message: { fontSize: 14, color: "#777" },
    emptyText: { textAlign: "center", marginTop: 20, color: "#999" },
});

export default MessageHome;
