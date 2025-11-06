import { View, Text, Touchable, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'

type SaveButtonProps = {
  onPress?: () => void;
  loading?: boolean;
}

const SaveButton = ({onPress, loading}:SaveButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className='bg-black h-[55px] w-[101.28px] justify-center items-center rounded-[4px]'
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className='text-white font-semibold text-[18.13px]'>Kaydet</Text>
      )}
    </TouchableOpacity>
  )
}
export default SaveButton