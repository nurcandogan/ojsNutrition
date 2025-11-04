import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import İnput from '../../components/TabsMenu/BizeUlasin/İnput';

const AddressForm = () => {
  const [adressName, setAddressName] = React.useState('');
  const [name, setName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [adress, setAdress] = React.useState('');
  const [apartment, setApartment] = React.useState('');
  const [city, setCity] = React.useState('');
  const [district, setDistrict] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  return (
    <SafeAreaView>
      <View>
        <İnput name={'name'} surname={'surname'} email={undefined} message={''}/>
      </View>
    </SafeAreaView>
  )
}

export default AddressForm