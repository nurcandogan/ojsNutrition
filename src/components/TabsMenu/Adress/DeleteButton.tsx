import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'

type DeleteButtonProps = {
  onPress?: () => void;
  loading?: boolean;
}

const DeleteButton = ({onPress, loading}: DeleteButtonProps) => {
  return (
    // SaveButton ile aynı yükseklik (h-[55px]) ancak arka plan kırmızı (bg-red-500)
    // Genişliği biraz esnek bıraktım veya SaveButton gibi sabit verebilirsin.
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className='bg-red-500 h-[55px] w-[101.28px] justify-center items-center rounded-[4px] mr-3'
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className='text-white font-semibold text-[18.13px]'>Sil</Text>
      )}
    </TouchableOpacity>
  )
}

export default DeleteButton