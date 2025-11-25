import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { AddressProps } from '../../../navigation/services/addressService';
import { Feather } from '@expo/vector-icons';

interface AddressCardProps {
    address: AddressProps;
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;

}

const AddressCard = ({ address, isSelected, onSelect, onEdit }: AddressCardProps) => {
  return (
   <TouchableOpacity onPress={onSelect}
    className={`bg-white rounded-lg p-4 mb-4 border ${isSelected ? 'border-indigo-600' : 'border-gray-200'} shadow-sm`} >
    <View className='flex-row justify-between items-start'>
        <View className="flex-row items-center flex-1 pr-4">
          {/* Seçim durumuna göre ikon gösterimi */}
          <Feather 
            name={isSelected ? "check-circle" : "circle"} 
            size={20} 
            color={isSelected ? "#4F46E5" : "#6B7280"} 
            className="mr-3"
          />
          <Text className="text-indigo-600 font-bold ml-2 text-base">{address.title}</Text>
        </View>
                
                  
       {/* Düzenleme Butonu */}
        <TouchableOpacity onPress={onEdit} className="py-1 px-2 border border-gray-300 rounded-md">
          <Text className="text-gray-600 font-semibold text-xs">Düzenle</Text>
        </TouchableOpacity>
              
    </View>
   
   {/* Adres Detayları */}
      <Text className="text-[16px] font-semibold mt-3">
        {address.first_name} {address.last_name}
      </Text>

      <Text className="text-gray-700 mt-1">{address.phone_number}</Text>

      <Text className="text-gray-600 mt-1 leading-5">
        {address.full_address}
      </Text>

      <Text className="text-gray-900 font-semibold mt-2 text-sm">
        {address.subregion?.name} / {address.region?.name}
      </Text>
   </TouchableOpacity>
  )
}

export default AddressCard