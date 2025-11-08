import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

type OkInputProps = {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
};

const OkInput = ({ title, onPress, disabled }: OkInputProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`w-[352px] h-[55px] items-center justify-center rounded-[4px]  ${
        disabled ? 'bg-neutral-500' : 'bg-black'
      }`}
    >
      <Text className={`text-white text-[18.13px] font-semibold`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default OkInput;
