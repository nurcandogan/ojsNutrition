import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'

interface MenuItemProps {
  label: string;
  onPress: () => void;
}

const MenuItem = ({label, onPress}:MenuItemProps) => {

  return (
   <TouchableOpacity onPress={onPress} className="px-4 py-7   ">
        <Text className="text-[13.63px] font-light">{label}</Text>
   </TouchableOpacity>
  )
}

export default MenuItem