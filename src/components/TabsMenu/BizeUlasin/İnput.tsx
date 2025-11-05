import { View, TextInput, Text } from 'react-native'
import React from 'react'

interface SingleInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  title?: string;
}

const İnput = ({ value, onChangeText, placeholder, multiline = false, title }: SingleInputProps) => {
  return (
     
      <View className='mt-4'>
        <Text className='px-5 mb-3 text-[13.75px] font-medium'>{title}</Text>

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
      </View>
    
    
  );
};

export default İnput;
