import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import Feather from '@expo/vector-icons/Feather';

// Yardımcı Input Parçası (Kaymayı önlemek için sabit stil)
const CardInputItem = ({ label, value, onChangeText, placeholder, keyboardType = 'default', isHalf = false, secureTextEntry = false }: any) => (
    <View className={`mb-4 ${isHalf ? 'w-[48%]' : 'w-full'}`}>
        <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">{label}</Text>
        <View className="h-[50px] bg-white border border-gray-300 rounded-lg justify-center px-3">
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                style={{ fontSize: 14, color: '#000', height: '100%' }}
                placeholderTextColor="#9CA3AF"
            />
        </View>
    </View>
);

interface CardFormInputsProps {
    cardNumber: string; setCardNumber: (text: string) => void;
    cardHolder: string; setCardHolder: (text: string) => void;
    cardExpire: string; setCardExpire: (text: string) => void;
    cardCvc: string; setCardCvc: (text: string) => void;
}

const CardFormInputs: React.FC<CardFormInputsProps> = ({
    cardNumber, setCardNumber,
    cardHolder, setCardHolder,
    cardExpire, setCardExpire,
    cardCvc, setCardCvc,
}) => {
    return (
        <View className="mt-2 pt-4 border-t border-gray-100">
            <CardInputItem label="Kart Numarası" value={cardNumber} onChangeText={setCardNumber} placeholder="XXXX XXXX XXXX XXXX" keyboardType="numeric" />
            
            <CardInputItem label="Kart Üzerindeki İsim" value={cardHolder} onChangeText={setCardHolder} placeholder="Ad Soyad" />
            
            <View className="flex-row justify-between">
                <CardInputItem label="Ay / Yıl" value={cardExpire} onChangeText={setCardExpire} placeholder="AA/YY" keyboardType="numeric" isHalf />
                <CardInputItem label="CVC" value={cardCvc} onChangeText={setCardCvc} placeholder="XXX" keyboardType="numeric" isHalf secureTextEntry />
            </View>

            <TouchableOpacity className="flex-row items-start mt-1">
                <Feather name="square" size={20} color="#4F46E5" />
                <Text className="ml-2 text-xs text-gray-600 flex-1">
                    Kartımı <Text className="font-bold text-black">Masterpass</Text> altyapısında saklamak istiyorum.
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default CardFormInputs;