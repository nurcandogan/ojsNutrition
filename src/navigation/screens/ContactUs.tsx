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
    <ScrollView>
     <BackHeader onPress={() => navigation.goBack()} title="Bize Ulaşın"/>
       <View className='mt-14 '>
        <Text className='text-[14.18px] font-bold text-center leading-6'>
           Bize aşağıdaki iletişim formundan veya destek@proteinocean.com e-posta adresinden ulaşabilirsiniz.
        </Text>
       </View>
       
        <View>
          <İnput
           name={name}
           surname={surname}
           email={email}
           message={message}
          />
        </View>
         
         <View className='mx-6'>
           <Text className='text-[12.14px] mt-10  leading-5 font-medium'>
             *Aynı gün kargo hafta içi 16:00, Cumartesi ise 11:00' a kadar verilen siparişler icin geçerlidir.{'\n'}
              Siparişler kargoya verilince e-posta ve sms ile bilgilendirme yapılır.
           </Text>
           <Text className='text-[12.14px] mt-6  leading-5 font-medium'>
              Telefon ile <Text className='font-bold'>0850 303 29 89</Text> numarasını arayarak da bizlere
              sesli mesaj bırakabilirsiniz . Sesli mesajlarınıza hafta içi saat
              <Text className='font-bold'> 09:00-17:00</Text> arasında dönüş sağlanmaktadır.
           </Text>
         </View>

       </ScrollView>
   </SafeAreaView>
  )
}

export default ContactUs