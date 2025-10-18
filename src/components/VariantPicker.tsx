import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { Variant } from '../../services/productService';

interface Props {
  aromas: string[];
  selectedAroma: string | null;
  onSelectAroma: (a: string) => void;
  sizeOptions: Variant[];
  selectedVariantId: string | null;
  onSelectVariant: (v: Variant) => void;
}

const VariantPicker = ({
  aromas,
  selectedAroma,
  onSelectAroma,
  sizeOptions,
  selectedVariantId,
  onSelectVariant,
}: Props) => {
  return (
    <>
      {/* AROMA */}
      <View className="mt-4 px-4">
        <Text className="text-[14px] font-bold mb-2">AROMA:</Text>
        <View className="flex-row flex-wrap">
          {aromas.map((a) => {
            const label = a ?? 'Aromasız';
            const active = (a ?? 'Aromasız') === (selectedAroma ?? 'Aromasız');
            return (
              <TouchableOpacity
                key={label}
                onPress={() => onSelectAroma(a)}
                className={`px-3 py-2 mr-2 mb-2 rounded-lg border ${active ? 'border-black bg-black' : 'border-neutral-400 bg-white'}`}
              >
                <Text className={`text-[13px] ${active ? 'text-white font-semibold' : 'text-black'}`}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* BOYUT */}
      <View className="mt-4 px-4">
        <Text className="text-[14px] font-bold mb-2">BOYUT:</Text>
        <View className="flex-row flex-wrap">
          {sizeOptions.map((v) => {
            const active = v.id === selectedVariantId;
            const sizeLabel =
              (v.size?.pieces ? `${v.size.pieces}` : '') +
              (v.size?.total_services ? ` / ${v.size.total_services} servis` : '');
            return (
              <TouchableOpacity
                key={v.id}
                onPress={() => onSelectVariant(v)}
                className={`px-3 py-2 mr-2 mb-2 rounded-lg border ${active ? 'border-indigo-600' : 'border-neutral-300'}`}
              >
                <Text className={`text-[13px] ${active ? 'font-semibold' : ''}`}>{sizeLabel || 'Seçenek'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </>
  );
};

export default VariantPicker;
