import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Menu, Provider } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import { IClassItem, getClassOpen, searchClassOpen } from 'src/services/class.service';
import { selectAuth } from 'src/redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { sanitizeFilters } from 'src/common/constants';
import { useAppDispatch } from 'src/redux';
import { showLoading, hideLoading } from 'src/redux/slices/loadingSlice';
const ClassListOpen = () => {
    const dispatch = useAppDispatch()
    const [classes, setClasses] = useState<IClassItem[]>([]);
    const [totalRecords, setTotalRecords] = useState(0); // State to hold total records
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const auth = useSelector(selectAuth);
    const [filters, setFilters] = useState({ token: auth?.user?.token, class_id: '', class_name: '', status: '', class_type: '' });
    const [menuTypeVisible, setMenuTypeVisible] = useState(false);
    const [menuStatusVisible, setMenuStatusVisible] = useState(false);
    const [isSeach, setIsSearch] = useState(false)


    const fetchAllClasses = async () => {
        try {
            dispatch(showLoading())
            const response = await getClassOpen({
                token: auth?.user?.token,
                pageable_request: {
                    page: currentPage - 1,
                    page_size: itemsPerPage
                }
            });
            dispatch(hideLoading())
            const data = response.data.page_content;
            setClasses(data);
            setTotalRecords(response.data.page_info.total_records);  // Get total records from API response
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };
    useEffect(() => {
        if (isSeach) {
            fetchClassesByFilter()
        } else {
            fetchAllClasses();
        }
    }, [currentPage]);

    const fetchClassesByFilter = async () => {
        try {
            const sanitizedFilters = sanitizeFilters(filters);  // Lọc filters trước khi gửi'
            dispatch(showLoading())
            const response = await searchClassOpen({
                token: filters.token,
                class_id: sanitizedFilters.class_id,
                class_name: sanitizedFilters.class_name,
                status: sanitizedFilters.status,
                class_type: sanitizedFilters.class_type,
                pageable_request: {
                    page: currentPage - 1,
                    page_size: itemsPerPage
                }
            });
            dispatch(hideLoading())
            setClasses(response.data.page_content);  // Cập nhật dữ liệu tìm kiếm từ API
            setTotalRecords(response.data.page_info.total_records);
            if (!isSeach) setCurrentPage(1);  // Reset trang khi tìm kiếm
        } catch (error) {
            console.error("Lỗi khi gọi API tìm kiếm:", error);
        }
    };

    const handleSearch = () => {
        setIsSearch(true)
        fetchClassesByFilter();  // Gọi API tìm kiếm khi nhấn nút tìm kiếm
    };
    const handleClearSeach = () => {
        if (isSeach) {
            setIsSearch(false);  // Reset search state
            fetchAllClasses();   // Fetch all classes
            setCurrentPage(1);   // Reset current page to 1
            setFilters((prevFilters) => ({
                token: prevFilters.token,  // Keep the token as it is
                class_id: '',              // Reset class_id to ''
                class_name: '',            // Reset class_name to ''
                status: '',                // Reset status to ''
                class_type: '',            // Reset class_type to ''
            }));
        }
    };


    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalRecords / itemsPerPage)) {
            setCurrentPage(currentPage + 1);  // Chuyển đến trang tiếp theo nếu còn trang
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);  // Quay lại trang trước nếu không phải trang đầu
        }
    };

    const isNextPageDisabled = currentPage === Math.ceil(totalRecords / itemsPerPage);
    const isPreviousPageDisabled = currentPage === 1;

    const handleTypeMenuSelect = (option: 'LT' | 'BT' | 'LT_BT') => {
        setFilters({ ...filters, class_type: option });
        setMenuTypeVisible(false);
    };

    const handleStatusMenuSelect = (option: 'ACTIVE' | 'COMPLETED' | 'UPCOMING') => {
        setFilters({ ...filters, status: option });
        setMenuStatusVisible(false);
    };

    return (
        <Provider>
            <View style={styles.container}>
                {/* Filter Bar */}
                <View style={styles.filterBar}>
                    {/* <TextInput
                        style={styles.input}
                        placeholder="Class ID"
                        value={filters.class_id}
                        onChangeText={(text) => setFilters({ ...filters, class_id: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Class Name"
                        value={filters.class_name}
                        onChangeText={(text) => setFilters({ ...filters, class_name: text })}
                    /> */}
                    <Menu
                        visible={menuTypeVisible}
                        onDismiss={() => setMenuTypeVisible(false)}
                        anchor={
                            <TouchableOpacity style={styles.selectPeriod} onPress={() => setMenuTypeVisible(true)}>
                                <Text style={styles.selectText}>
                                    {filters.class_type || 'Class_Type'}
                                </Text>
                                <Icon name='caret-down' size={20} />
                            </TouchableOpacity>
                        }
                    >
                        <Menu.Item onPress={() => handleTypeMenuSelect('LT')} title='LT' />
                        <Menu.Item onPress={() => handleTypeMenuSelect('BT')} title='BT' />
                        <Menu.Item onPress={() => handleTypeMenuSelect('LT_BT')} title='LT_BT' />
                    </Menu>

                    <Menu
                        visible={menuStatusVisible}
                        onDismiss={() => setMenuStatusVisible(false)}
                        anchor={
                            <TouchableOpacity style={styles.selectPeriod} onPress={() => setMenuStatusVisible(true)}>
                                <Text style={styles.selectText}>
                                    {filters.status || 'Status'}
                                </Text>
                                <Icon name='caret-down' size={20} />
                            </TouchableOpacity>
                        }
                    >
                        <Menu.Item onPress={() => handleStatusMenuSelect('ACTIVE')} title='ACTIVE' />
                        <Menu.Item onPress={() => handleStatusMenuSelect('COMPLETED')} title='COMPLETED' />
                        <Menu.Item onPress={() => handleStatusMenuSelect('UPCOMING')} title='UPCOMING' />
                    </Menu>
                    <View style={styles.buttonContainer}>
                        <Button title="Search" onPress={handleSearch} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button color={color.primary} title="Xóa search" onPress={handleClearSeach} />
                    </View>

                </View>

                {/* Table with Horizontal Scroll */}
                <ScrollView horizontal={true} style={styles.tableContainer}>
                    <View>
                        {/* Table Header */}
                        <View style={styles.headerRow}>
                            <Text style={[styles.cellHeader, { width: 50 }]}>STT</Text>
                            <Text style={[styles.cellHeader, { width: 100 }]}>Class ID</Text>
                            <Text style={[styles.cellHeader, { width: 150 }]}>Class Name</Text>
                            <Text style={[styles.cellHeader, { width: 100 }]}>Type</Text>
                            <Text style={[styles.cellHeader, { width: 150 }]}>Lecturer</Text>
                            <Text style={[styles.cellHeader, { width: 130 }]}>Student Count</Text>
                            <Text style={[styles.cellHeader, { width: 120 }]}>Start Date</Text>
                            <Text style={[styles.cellHeader, { width: 120 }]}>End Date</Text>
                            <Text style={[styles.cellHeader, { width: 100 }]}>Status</Text>
                        </View>

                        {/* Table Rows */}
                        {classes.map((item: any, index) => (
                            <View key={item.class_id} style={styles.row}>
                                <Text style={[styles.cell, { width: 50 }]}>
                                    {currentPage > 1 ? (index + 1) + (currentPage - 1) * itemsPerPage : index + 1}
                                </Text>
                                <Text style={[styles.cell, { width: 100 }]}>{item.class_id}</Text>
                                <Text style={[styles.cell, { width: 150 }]}>{item.class_name}</Text>
                                <Text style={[styles.cell, { width: 100 }]}>{item.class_type}</Text>
                                <Text style={[styles.cell, { width: 150 }]}>{item.lecturer_name}</Text>
                                <Text style={[styles.cell, { width: 130 }]}>{item.student_count}</Text>
                                <Text style={[styles.cell, { width: 120 }]}>{item.start_date}</Text>
                                <Text style={[styles.cell, { width: 120 }]}>{item.end_date}</Text>
                                <Text style={[styles.cell, { width: 100 }]}>{item.status}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* Pagination */}
                {totalRecords > 0 && (
                    <View style={styles.pagination}>
                        <View style={styles.pageButtonContainer}>
                            <Button
                                title="<"
                                onPress={handlePreviousPage}
                                disabled={isPreviousPageDisabled}
                            />
                        </View>
                        <Text style={styles.pageIndicator}>
                            {`${currentPage} / ${Math.ceil(totalRecords / itemsPerPage)}`}
                        </Text>
                        <View style={styles.pageButtonContainer}>
                            <Button
                                title=">"
                                onPress={handleNextPage}
                                disabled={isNextPageDisabled}
                            />
                        </View>
                    </View>
                )}
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#fff' },
    filterBar: { flexDirection: 'row', marginBottom: 10, flexWrap: 'wrap' },
    input: { flex: 1, borderWidth: 1, margin: 5, padding: 8, borderRadius: 5, minWidth: 150 },
    tableContainer: {
        marginVertical: 10,
        maxHeight: 400,
    },
    headerRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc', backgroundColor: '#f9f9f9' },
    row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc' },
    cellHeader: { fontWeight: 'bold', padding: 5, textAlign: 'center' },
    cell: { padding: 5, textAlign: 'center' },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
    selectPeriod: {
        margin: 15,
        borderWidth: 1,
        borderRadius: 10,
        width: 150,
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row'
    },
    selectText: { fontWeight: '500', color: '#333' },
    buttonContainer: {
        paddingLeft: 20
    },

});

export default ClassListOpen;
