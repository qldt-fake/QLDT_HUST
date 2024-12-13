// src/components/NetworkErrorModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import cụ thể một bộ icon
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo

interface NetworkErrorModalProps {
    isOffline: boolean;
    onRetry: () => void;
}

const NetworkErrorModal: React.FC<NetworkErrorModalProps> = ({ isOffline, onRetry }) => {
    const [isConnected, setIsConnected] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected || false);
        });

        return () => {
            unsubscribe();
        };
    }, []);
    
    const handleRetry = () => {
        onRetry(); // Gọi hàm để đóng modal hoặc thực hiện hành động khác
    };

    return (
        <Modal
            visible={isOffline}
            transparent={true}
            animationType="fade"
            onRequestClose={onRetry} // Đảm bảo khi nhấn ngoài modal hoặc nhấn nút back, đóng modal
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <FontAwesome name="wifi-off" size={50} color="red" />
                    <Text style={styles.modalText}>Mất kết nối mạng</Text>
                    <Text style={styles.modalSubText}>Kiểm tra kết nối mạng của bạn</Text>
                    <Button title="Ok" onPress={handleRetry} />
                </View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginVertical: 10,
    },
    modalSubText: {
        marginBottom: 20,
    },
});

export default NetworkErrorModal;
