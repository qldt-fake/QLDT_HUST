import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useSelector } from 'react-redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import StudentCard from './StudentCard';  // Component hiển thị thông tin học sinh
import { color } from 'src/common/constants/color';
import { searchAccount } from 'src/services/class.service';
import { useAppDispatch } from 'src/redux';
import { showLoading, hideLoading } from 'src/redux/slices/loadingSlice';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import BaseModalError from 'src/components/BaseModalError';
import BaseModalSuccess from 'src/components/BaseModalSuccess';
import { CODE_OK } from 'src/common/constants/responseCode';
const StudentSearch = () => {
    const naviagion: NavigationProp<ClassNavigationType, 'ClassDetail'> = useNavigation();
    const route: RouteProp<ClassNavigationType, 'AddStudent'> = useRoute();
    const { class_id } = route.params;
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0); // State to hold total records
    const itemPerPages = 5;
    const auth = useSelector(selectAuth);
    const user = auth.user;
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch = useAppDispatch()
    const [textError, setTextError] = useState<string>('');
    const [textSuccess, setTextSuccess] = useState<string>('');
    useEffect(() => {
        if (searchQuery === '') {
            setFilteredStudents([]); // Khi searchQuery rỗng, setFilteredStudents là mảng rỗng
            setCurrentPage(1)
        }
    }, [searchQuery]);
    useEffect(() => {
        fetchStudents()
    }, [currentPage])
    // Fetch students from API based on search query
    const fetchStudents = async () => {
        try {
            // Gọi API để tìm kiếm học sinh theo từ khóa
            dispatch(showLoading())
            const response = await searchAccount({
                search: searchQuery,
                pageable_request: {
                    page: currentPage - 1,
                    page_size: itemPerPages
                }
            });
            dispatch(hideLoading())
            setFilteredStudents(response.data.page_content);  // Lưu danh sách học sinh vào state
            setTotalRecords(response.data.page_info.total_records);  // Get total records from API response
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };
    const handleSearchButtonClick = () => {
        fetchStudents();
    }
    // Phân trang
    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalRecords / itemPerPages)) {
            setCurrentPage(currentPage + 1);  // Chuyển đến trang tiếp theo nếu còn trang
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);  // Quay lại trang trước nếu không phải trang đầu
        }
    };
    const handleAddStudent = async (response: any) => {
        if (response.meta.code !== CODE_OK) {
            setTextError(response.meta.message)
        } else {
            setTextSuccess("Thêm học sinh thành công!")

        }
    };
    const onBackdropPress = () => {
        setTextError('');
    };
    const handleOkPress = () => {
        naviagion.navigate('ClassDetail', {
            classId: class_id 
        });
    };


    const isNextPageDisabled = currentPage === Math.ceil(totalRecords / itemPerPages);
    const isPreviousPageDisabled = currentPage === 1;
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={handleSearch}  // Cập nhật query khi người dùng thay đổi
                placeholder="Tìm kiếm học sinh..."
                autoCapitalize="none"
            />

            {/* Nút tìm kiếm */}
            <TouchableOpacity style={styles.searchButton} onPress={handleSearchButtonClick}>
                <Text style={styles.searchButtonText}>Tìm kiếm</Text>
            </TouchableOpacity>
            {filteredStudents.length > 0 ? (
                <FlatList
                    data={filteredStudents}
                    renderItem={({ item }) => (
                        <StudentCard
                            props={{ ...item, isSearch: true, token: user?.token, class_id: class_id }}
                            onAddStudent={handleAddStudent}
                        />
                    )}
                    keyExtractor={(item) => item.account_id.toString()}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    ListFooterComponent={
                        filteredStudents.length > 0 ? (
                            <View style={styles.pagination}>
                                <View style={styles.pageButtonContainer}>
                                    <Button title="<" onPress={handlePreviousPage} disabled={isPreviousPageDisabled} />
                                </View>
                                <Text style={styles.pageIndicator}>
                                    {`${currentPage} / ${Math.ceil(totalRecords / itemPerPages)}`}
                                </Text>
                                <View style={styles.pageButtonContainer}>
                                    <Button title=">" onPress={handleNextPage} disabled={isNextPageDisabled} />
                                </View>
                            </View>
                        ) : (
                            <></>
                        )
                    }
                />

            )
                : <Text> Không có dữ liệu...</Text>
            }
            <BaseModalError title={textError} isVisible={!!textError} onBackdropPress={onBackdropPress} />
            <BaseModalSuccess
                title={textSuccess}
                isVisible={!!textSuccess}
                onOkPress={handleOkPress} // Truyền hàm vào prop này
            />
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 10,
    },
    searchButton: {
        backgroundColor: color.second,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
    },
    list: {
        paddingBottom: 20,
    },
    pageButtonContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,  // Thêm khoảng cách giữa các nút
    },
    pageIndicator: {
        fontSize: 16,
    },
    pagination: {
        zIndex: 999,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default StudentSearch;
