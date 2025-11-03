import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
import { useNavigation } from '@react-navigation/native';
import İnput from '../../components/TabsMenu/BizeUlasin/İnput';

const ContactUs = () => {
  const [name, setName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const navigation = useNavigation<any>();
  return (
   <SafeAreaView className='flex-1 bg-white'>
     <BackHeader onPress={() => navigation.goBack()} title="Bize Ulaşın"/>
       <View className='mt-16 '>
        <Text className='text-[14.18px] font-bold text-center '>
           Bize aşağıdaki iletişim formundan veya destek@proteinocean.com e-posta adresinden ulaşabilirsiniz.
        </Text>
       </View>
       <ScrollView>
        <View>
          <İnput
           name={name}
           surname={surname}
           email={email}
           message={message}
          />
        </View>
       </ScrollView>
   </SafeAreaView>
  )
}

export default ContactUs