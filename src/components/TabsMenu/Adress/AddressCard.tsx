import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { AddressProps } from '../../../navigation/services/addressService';
import { Feather } from '@expo/vector-icons';

interface AddressCardProps {
    address: AddressProps;
    isSelected?: boolean; // Opsiyonel yapıldı
    onSelect?: () => void; // Opsiyonel yapıldı
    onEdit: () => void;
    isSelectable?: boolean; // 🔥 YENİ ÖZELLİK: Seçim modu açık mı?
}

const AddressCard = ({ 
    address, 
    isSelected = false, 
    onSelect, 
    onEdit, 
    isSelectable = true // Varsayılan olarak (Checkout'ta) seçilebilir olsun
}: AddressCardProps) => {
  return (
   <TouchableOpacity 
    // Eğer seçilebilir değilse (Profil sayfası), karta tıklayınca seçim yapma
    onPress={isSelectable ? onSelect : undefined}
    activeOpacity={isSelectable ? 0.7 : 1}
    className={`bg-white rounded-lg p-4 mb-4 border ${isSelectable && isSelected ? 'border-indigo-600' : 'border-gray-200'} shadow-sm`} 
   >
    <View className='flex-row justify-between items-start'>
        <View className="flex-row items-center flex-1 pr-4">
          
          {/* 🔥 SADECE SEÇİLEBİLİR MODDA İSE RADYO BUTONU GÖSTER */}
          {isSelectable && (
              <Feather 
                name={isSelected ? "check-circle" : "circle"} 
                size={20} 
                color={isSelected ? "#4F46E5" : "#6B7280"} 
                className="mr-3"
              />
          )}
          
          {/* Başlık Rengi: Seçim modu kapalıysa (Profil) Turuncu, değilse Siyah/Mor */}
          <Text className={`${!isSelectable ? 'text-orange-500' : (isSelected ? 'text-indigo-600' : 'text-black')} font-bold ml-2 text-base`}>
            {address.title}
          </Text>
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

export default AddressCard;