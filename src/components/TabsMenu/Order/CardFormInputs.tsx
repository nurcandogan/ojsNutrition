import { View, Text, TouchableOpacity, TextInput, KeyboardTypeOptions } from 'react-native';
import React from 'react';
import Feather from '@expo/vector-icons/Feather';

// Temel Input Öğesi Bileşeni (Dikey boşluğu garantiler)
interface BasicCardInputProps {
    label: string; 
    value: string; 
    onChangeText: (text: string) => void; 
    placeholder?: string; 
    keyboardType?: KeyboardTypeOptions; 
    isHalf?: boolean; 
    secureTextEntry?: boolean;
}

const BasicCardInput: React.FC<BasicCardInputProps> = 
  ({ label, value, onChangeText, placeholder, keyboardType = 'default', isHalf = false, secureTextEntry = false }) => (
    // Dikey boşluk (mb-5) ve genişlik yönetimi ile üst üste binme engellenir
    <View className={`mb-5 ${isHalf ? 'w-1/2 pr-2' : 'w-full'}`}> 
      
      {/* Etiket */}
      <Text className='ml-1 mb-1 text-sm font-semibold text-gray-800'>{label}</Text> 
      
      {/* TextInput kullanımı */}
      <View className='rounded-md h-[50px] border border-gray-300 bg-white px-3 justify-center'>
        <TextInput 
           className='text-base w-full h-full' 
           value={value} 
           onChangeText={onChangeText} 
           placeholder={placeholder} 
           keyboardType={keyboardType}
           secureTextEntry={secureTextEntry}
           placeholderTextColor="#A0AEC0"
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
        <View className="mt-4 pt-4 border-t border-gray-200">
            
            <BasicCardInput label="Kart Numarası" value={cardNumber} onChangeText={setCardNumber} placeholder="XXXX XXXX XXXX XXXX" keyboardType="numeric" />
            
            <BasicCardInput label="Kart Üzerindeki İsim" value={cardHolder} onChangeText={setCardHolder} placeholder="Ad Soyad" />
            
            {/* Yatay Yapı: Ay/Yıl ve CVC */}
            <View className="flex-row justify-between w-full">
                <BasicCardInput label="Ay / Yıl" value={cardExpire} onChangeText={setCardExpire} placeholder="AA / YY" keyboardType="numeric" isHalf />
                
                <View className="w-1/2 pl-2">
                    <BasicCardInput label="CVC" value={cardCvc} onChangeText={setCardCvc} placeholder="XXX" keyboardType="numeric" secureTextEntry />
                </View>
            </View>
            
            {/* Masterpass Checkbox */}
            <TouchableOpacity onPress={() => {/* Masterpass State Güncellemesi */}} className="flex-row items-center mt-3">
                <Feather name="square" size={20} color="#4F46E5" />
                <Text className="ml-2 text-sm text-gray-700">
                    Kartımı <Text className="font-bold text-red-500">masterpass</Text> altyapısında saklamak <Text className="text-indigo-600 font-semibold">istiyorum.</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default CardFormInputs;