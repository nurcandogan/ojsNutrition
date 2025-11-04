import { View, TextInput } from 'react-native'
import React from 'react'

interface SingleInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
}

const İnput = ({ value, onChangeText, placeholder, multiline = false }: SingleInputProps) => {
  return (
    <View className="mb-4 items-center">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A1A1AA"
        multiline={multiline}
        className={`border px-5 w-[358px] ${multiline ? 'h-[150px] pt-3' : 'h-[50px]'} text-sm border-bordergray bg-commentBg rounded-[4px]`}
      />
      
    </View>
    
    
  );
};

export default İnput;
