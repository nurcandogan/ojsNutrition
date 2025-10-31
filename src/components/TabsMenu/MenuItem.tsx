import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'

interface MenuItemProps {
  label: string;
  onPress: () => void;
}

const MenuItem = ({label, onPress}:MenuItemProps) => {

  return (
   <TouchableOpacity onPress={onPress} className="px-4 py-4 bg-white border-b border-gray-100">
        <Text className="text-[16px]">{label}</Text>
   </TouchableOpacity>
  )
}

export default MenuItem