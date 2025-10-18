import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';

interface CollapseSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapseSection = ({title, children, defaultOpen = false}: CollapseSectionProps ) => {
    const [open, setOpen] = useState(defaultOpen);
  return (
    <View className='border-b border-neutral-200'>
        <TouchableOpacity className="flex-row justify-between items-center py-4" onPress={() => setOpen(!open)}>
            <Text className='text-[15px] font-semibold'>{title} </Text>
            <AntDesign name={open ? 'up' : 'down'} size={16} />
        </TouchableOpacity>
         {open ? <View className="pb-4">{children}</View> : null}
    </View>
  )
}

export default CollapseSection