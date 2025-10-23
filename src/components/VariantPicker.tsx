import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { Variant } from '../navigation/services/productService';

interface VariantPickerProps {
  aromas: string[];
  selectedAroma: string | null;
  onSelectAroma: (aroma: string) => void;
  sizeOptions: Variant[];
  selectedVariantId: string | null;
  onSelectVariant: (variant: Variant) => void; 
}

const VariantPicker = ({aromas, selectedAroma, onSelectAroma, sizeOptions, selectedVariantId, onSelectVariant}: VariantPickerProps) => {
  return (
   <>
    {/* AROMA SEÇİMİ */}
    <View className='px-5 mt-4'>
      <Text className='text-lg font-bold'>AROMA:</Text>
      <View className='flex-row flex-wrap'>
        {aromas.map((aroma) => {
            const label = aroma ?? 'Aromasız';
            const active = (aroma ?? 'Aromasız') === (selectedAroma ?? 'Aromasız');
            return (
              <TouchableOpacity key={label} onPress={()=>onSelectAroma(aroma)}    //aromas filtrelendiği için benzersiz suan o sebeple key'e direkt label diyebiliriz..
              className={`px-5 py-2 mt-2 mr-2 mb-2 border ${active ? 'border-black bg-black' : 'border-neutral-400 bg-white'} `}>

                   <Text className={`text-sm ${active ? 'text-slate-200' : 'text-black'} ` }>
                     {label}  
                   </Text>
              </TouchableOpacity>  

            );
        })}
      </View>
    </View>
   
    {/* BOYUT SEÇİMİ */}
    <View className='px-5 mt-4 '>
      <Text className='text-lg font-bold'>BOYUT:</Text>
      <View className='flex-row flex-wrap'>
        {sizeOptions.map((variant) => {
            const active = variant.id === selectedVariantId;
            const label = (variant.size?.pieces ? `${variant.size.pieces}` : '') +
             (variant.size?.total_services ? `/${variant.size.total_services} servis` : '');
            return (
              <TouchableOpacity key={variant.id} onPress={()=>onSelectVariant(variant)}
              className={`px-4 py-2 mt-2 mr-2 mb-2 border ${active ? 'border-black bg-black' : 'border-neutral-400 bg-white'} `}>

                   <Text className={`text-sm ${active ? 'text-slate-200' : 'text-black'} ` }>
                     {label}  
                   </Text>
              </TouchableOpacity>  

            );
        })}
      </View>
    </View>
    
</>
  );
};

export default VariantPicker