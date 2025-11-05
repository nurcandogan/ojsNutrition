import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import İnput from '../../components/TabsMenu/BizeUlasin/İnput';

const AddressForm = () => {
  const [adressName, setAdressName] = React.useState('');
  const [name, setName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [adress, setAdress] = React.useState('');
  const [apartment, setApartment] = React.useState('');
  const [city, setCity] = React.useState('');
  const [district, setDistrict] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  return (
    <SafeAreaView className='flex-1 bg-white '>
      <View className='mt-10'>
        <İnput value={adressName} onChangeText={setAdressName} placeholder="Adres Adı" />
<İnput value={name} onChangeText={setName} placeholder="Ad" />
<İnput value={surname} onChangeText={setSurname} placeholder="Soyad" />
<İnput value={adress} onChangeText={setAdress} placeholder="Adres" />
<İnput value={apartment} onChangeText={setApartment} placeholder="Apartman / Daire" />
<İnput value={city} onChangeText={setCity} placeholder="Şehir" />
<İnput value={district} onChangeText={setDistrict} placeholder="İlçe" />
<İnput value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Telefon" />

      </View>
    </SafeAreaView>
  )
}

export default AddressForm