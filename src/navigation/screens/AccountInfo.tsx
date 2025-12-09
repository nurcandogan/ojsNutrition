import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Input from '../../components/TabsMenu/BizeUlasin/Input'
import { Feather } from '@expo/vector-icons';
import OkInput from '../../components/TabsMenu/BizeUlasin/OkInput';
import SaveButton from '../../components/TabsMenu/Adress/SaveButton';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
import { useNavigation } from '@react-navigation/native';

const AccountInfo = () => {
  const navigation = useNavigation()
  const [name, setName] = React.useState('');
  const [surname, setSurname] = React.useState('');
   const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [isCheck, setIsCheck] = useState(false);
 
  

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <BackHeader 
          title='Hesap Bilgilerim'
          onPress={() => navigation.goBack()}
        />

      <View className='flex-row justify-between mt-14 mx-4'>
          <View>
            <Text className=" mb-3 text-[15.88px] font-medium">*Ad</Text>
            <TextInput className='w-[177px] h-[50px] text-sm px-5 border border-bordergray bg-commentBg rounded-[4px]' 
             placeholder='İsim'
             value={name}
             onChangeText={setName}/>
          </View>

          <View >
             <Text className=" mb-3 text-[15.88px] font-medium">*Soyad</Text>
              <TextInput className='w-[177px] h-[50px] text-sm px-5 border border-bordergray bg-commentBg rounded-[4px]'
              placeholder='Soyisim'
              value={surname}
              onChangeText={setSurname}/>
          </View>
      </View>

      <View className='mt-2'>
        <Input
          value={phone}
          onChangeText={setPhone}
          placeholder='Telefon Numarası'
          title='Telefon'
        />
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder='Email Adresi'
          title='*Email'
        />
      </View>

     
						<View className=" mx-5 self-center flex-row items-start mt-2 ">
							<TouchableOpacity onPress={() => setIsCheck(!isCheck)}>
								<Feather name={isCheck ? "check-square" : "square"} size={20} color={isCheck ? "#2126AB" : "#2126AB"} />
							</TouchableOpacity>
							<Text className="ml-2 flex-1 text-xs leading-[20px] text-ticaritext">
								Kampanyalardan haberdar olmak için <Text className="underline font-bold text-black ">Ticari Elektronik İleti Onayı </Text> metnini
								okudum, onaylıyorum. Tarafınızdan gönderilecek ticari elektronik iletileri almak istiyorum.{" "}
							</Text>
						</View>
  

          <View className='justify-end items-end mx-5 mt-14 mb-10'>
              <SaveButton onPress={() => {}}/>
          </View>
        

    </SafeAreaView>
  )
}

export default AccountInfo