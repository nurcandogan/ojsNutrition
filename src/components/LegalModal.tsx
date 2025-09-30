import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ContractModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const LegalModal: React.FC<ContractModalProps> = ({ visible, onClose, title, content }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-inherit bg-opacity-50 justify-center items-center ">
        <View className="w-11/12 h-4/5 bg-white rounded-3xl p-4 ">
          {/* Başlık ve Kapat butonu */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} />
            </TouchableOpacity>
          </View>

          {/* İçerik alanı, kaydırılabilir */}
          <ScrollView className="flex-1">
            <Text className="text-sm">{content}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default LegalModal;
