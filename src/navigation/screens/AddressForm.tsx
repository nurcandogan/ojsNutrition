import { View, Text, SafeAreaView } from 'react-native'
import React, { useRef } from 'react'
import İnput from '../../components/TabsMenu/BizeUlasin/İnput';
import { ScrollView } from 'react-native-gesture-handler';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
import { useNavigation } from '@react-navigation/native';
import SaveButton from '../../components/TabsMenu/Adress/SaveButton';
import PhoneField from '../../components/TabsMenu/Adress/PhoneField';

const AddressForm = () => {
  const [adressName, setAdressName] = React.useState('');
  const [name, setName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [adress, setAdress] = React.useState('');
  const [apartment, setApartment] = React.useState('');
  const [city, setCity] = React.useState('');
  const [district, setDistrict] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className='flex-1 bg-white '>
    <ScrollView className='mb-10'>
      <BackHeader onPress={() => navigation.goBack()} title="Adres Oluştur"/>
      <View className='mt-10'>
       <İnput value={adressName} onChangeText={setAdressName} placeholder="ev, iş vb.." title='*Adres Adı' />
       <İnput value={name} onChangeText={setName} placeholder=''  title='*Ad' />
       <İnput value={surname} onChangeText={setSurname} placeholder='' title='*Soyad'/>
       <İnput value={adress} onChangeText={setAdress} placeholder='' title='*Adres'/>
       <İnput value={apartment} onChangeText={setApartment} placeholder=''  title='Apartman / Daire' />
       <İnput value={city} onChangeText={setCity} placeholder='' title='*Şehir' />
       <İnput value={district} onChangeText={setDistrict} placeholder='' title='*İlçe'/>
        <PhoneField value={phoneNumber} onChange={setPhoneNumber} />
      </View>
      
      <View className='items-end mx-5 mt-14'>
        <SaveButton/>
      </View>
    </ScrollView>
   </SafeAreaView>
  )
}

export default AddressForm