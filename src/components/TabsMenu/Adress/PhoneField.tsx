import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import ModalArrowIcon from "../../../Svgs/ModalArrowIcon";

type PhoneFieldProps = {
  value: string;
  onChange: (text: string) => void;
};

const formatPhone = (text: string) => {
  let cleaned = text.replace(/\D/g, ""); // sadece rakamlar
  cleaned = cleaned.slice(0, 10); // max 10 hane

  let formatted = cleaned;
  if (cleaned.length > 3) {
    formatted = cleaned.slice(0, 3) + " " + cleaned.slice(3);
  }
  if (cleaned.length > 6) {
    formatted =
      cleaned.slice(0, 3) +
      " " +
      cleaned.slice(3, 6) +
      " " +
      cleaned.slice(6, 8);
  }
  if (cleaned.length > 8) {
    formatted =
      cleaned.slice(0, 3) +
      " " +
      cleaned.slice(3, 6) +
      " " +
      cleaned.slice(6, 8) +
      " " +
      cleaned.slice(8, 10);
  }

  return formatted;
};

const PhoneField = ({ value, onChange }: PhoneFieldProps) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [country, setCountry] = useState({
    cca2: "TR",
    callingCode: ["90"],
  });

  return (
    <View className="mx-5 mt-6">
      <Text className="mb-1 text-[13.75px] font-medium">*Telefon</Text>

      <View className="flex-row items-center border border-bordergray w-[358px] h-[50px] rounded-[4px] bg-commentBg px-3">

        <View pointerEvents="none">
          <CountryPicker
            countryCode={country.cca2 as any}
            withCallingCode
            withFlag
            withFilter
            visible={isPickerVisible}
            onClose={() => setIsPickerVisible(false)}
            onSelect={(c) => setCountry(c)}
          />
        </View>

        <TouchableOpacity onPress={() => setIsPickerVisible(true)}>
          <ModalArrowIcon />
        </TouchableOpacity>

        <Text className="ml-5 text-[14px] font-medium text-black">
          +{country.callingCode}
        </Text>

        <TextInput
          keyboardType="phone-pad"
          className="ml-3 flex-1 text-[14px] text-black pl-1"
          value={value}
          onChangeText={(text) => onChange(formatPhone(text))}
        />
      </View>
    </View>
  );
};

export default PhoneField;
