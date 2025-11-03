import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import BackIcon from '../../../Svgs/BackIcon'

const BackHeader = ({onPress,title}: any) => {
  return (
      <View className="px-4 mt-6">
          <TouchableOpacity onPress={onPress}>
            <Text className="text-[16.03px] font-semibold"> <BackIcon/>  {title} </Text>
          </TouchableOpacity>
        </View>
  )
}

export default BackHeader