import React, { createContext, useState, useContext, ReactNode } from 'react';
import BottomActionModal from 'src/components/BottomActionModal';
interface ModalContextProps {
  showModal: (title: string, actions: { icon: string; text: string; onPress: () => void }[]) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalActions, setModalActions] = useState<{ icon: string; text: string; onPress: () => void }[]>([]);

  const showModal = (title: string, actions: { icon: string; text: string; onPress: () => void }[]) => {
    setModalTitle(title);
    setModalActions(actions);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <BottomActionModal
        isVisible={modalVisible}
        title={modalTitle}
        actions={modalActions}
        onBackdropPress={hideModal}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};