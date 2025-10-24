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
const aromaColorMap: Record<string, string> = {
  'biskuvi': 'bg-bisküvi',
  'cikolata': 'bg-çikolata',
  'muz': 'bg-muz',
  'salted caramel': 'bg-caramel',
  'choco nut': 'bg-chocoNut',
  'hindistan cevizi': 'bg-hindistanCevizi',
  'raspberry cheesecake': 'bg-cheesecake',
  'cilek': 'bg-çilek',
};

//  normalizeText; Türkçe karakterleri temizler + "aromali" ifadesini kaldırır
const normalizeText = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/\s*aromali\s*/g, '');

const VariantPicker = ({aromas, selectedAroma, onSelectAroma, sizeOptions, selectedVariantId, onSelectVariant}: VariantPickerProps) => {
  return (
   <>
    {/* AROMA SEÇİMİ */}
    <View className='px-5 mt-4'>
      <Text className='text-lg font-bold'>AROMA:</Text>
      <View className='flex-row flex-wrap'>
        {aromas.map((aroma) => {
            const label = aroma ?? 'Aromasız';
            const normalizedLabel = normalizeText(label);
            const active = (aroma ?? 'Aromasız') === (selectedAroma ?? 'Aromasız');
            const colorClass = aromaColorMap[normalizedLabel] || 'bg-gray-300';


            return (
              <TouchableOpacity key={label} onPress={()=>onSelectAroma(aroma)}    //aromas filtrelendiği için benzersiz suan o sebeple key'e direkt label diyebiliriz..
              className={` mt-2 mr-3 mb-2 flex-row items-center justify-between  border-[4px] ${active ? 'border-logintext bg-white' : 'border-bordergray bg-white'} px-2 py-2 w-auto h-[40px] `}>

                   <Text className='text-sm text-black ' >
                     {label}  
                   </Text>
                   
                   <View className={`w-[20px] h-[27px] ml-4 ${colorClass}`} />

                   {active && (
                  <View className="absolute -right-3 -top-3 w-[20px] h-[20px] rounded-full bg-blue-700 flex items-center justify-center">
                    <Text className="text-white font-bold text-s">✓</Text>
                  </View>
                  )}
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
              className={`px-4 py-2 mt-2 mr-2 mb-2 border-[4px] ${active ? 'border-logintext bg-white' : 'border-bordergray bg-white'} `}>

                   <Text className='text-sm text-black'>
                     {label}  
                   </Text>
                 {active && (
                  <View className="absolute -right-3 -top-3 w-[20px] h-[20px] rounded-full bg-blue-700 flex items-center justify-center">
                    <Text className="text-white font-bold text-s">✓</Text>
                  </View>
                 )}
                   
              </TouchableOpacity>  

            );
        })}
      </View>
    </View>
    
</>
  );
};

export default VariantPicker