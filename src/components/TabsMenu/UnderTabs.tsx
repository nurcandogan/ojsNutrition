import { View, Text } from 'react-native'
import React from 'react'
import UnderTabsIcon from '../../Svgs/UnderTabsIcon'

const UnderTabs = ({title}:any) => {
  return (
       <View className="flex-row items-center mx-6 mt-4 py-2">
        <View className="flex-row items-center gap-2 ">
             <UnderTabsIcon/>
            <Text className="font-bold text-[16px]">{title}</Text>
         </View>
      </View>
  )
}

export default UnderTabs