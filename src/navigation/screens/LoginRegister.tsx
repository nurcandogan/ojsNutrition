import { View, Text, SafeAreaView, Image, TouchableOpacity ,ScrollView} from 'react-native'
import React, { useState } from 'react'
import LoginForm from '../../components/LoginForm'
import { useNavigation } from '@react-navigation/native';
import RegisterForm from '../../components/RegisterForm';


const LoginRegister = () => {
  const navigation = useNavigation();
   const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')

const handleEmailChange= (text:string)=> setEmail(text)
const handlePasswordChange= (text:string)=> setPassword(text)
const handleNameChange= (text:string)=> setName(text)
const handleSurnameChange= (text:string)=> setSurname(text)



const handleSubmit = () => {
    if (tab === 'login') {
      console.log('Login:', { email, password });
      navigation.navigate('HomeTabs');
    } 
  };

     const Wrapper = tab === 'register' ? ScrollView : View;
     const WrapperStyle = {
        alignItems: 'center' as const,
        paddingBottom: 40,
};
  
  return (
    <SafeAreaView className=' flex-1'>
      <Wrapper
        {...(tab === 'register' ? {
          contentContainerStyle: WrapperStyle,
          keyboardShouldPersistTaps: 'handled',
          horizontal: false,
        }: {
          style: WrapperStyle,
        }

      )}
      >
        
      <View className=' mt-5 '>
         <Image className='w-28 h-20' source={require('../../assets/ojs-1.png')} resizeMode="contain" />
      </View>
     <Text className="text-3xl font-bold ">
        {tab === 'login' ? 'Giriş Yap' : 'Üye Ol'}
     </Text>

    
      <View className="mt-10 flex-row w-[355px] mb-8 gap-4  ">
        <TouchableOpacity
       className={`flex-1 py-3  items-center justify-center  border border-gray-300 rounded-t-md  ${
            tab === 'login' ? 'bg-inherit' : 'bg-inputgray '
          }`} 
         onPress={() => setTab('login')} >
            <Text className={tab === 'login' ? 'font-bold text-logintext ' : 'text-black '}>
            Giriş Yap
            </Text>
        </TouchableOpacity>

        <TouchableOpacity
         className={`flex-1 py-3 items-center justify-center border border-gray-300 rounded-t-md  ${
            tab === 'register' ? 'bg-inherit' : 'bg-inputgray'
          }`}
        onPress={() => setTab('register')}>
            <Text className={tab === 'register' ? 'font-bold text-logintext' : 'text-black '}>
            Üye Ol
            </Text>
        </TouchableOpacity>
      </View>


     <View>
      {tab === 'login' ? (
        <>
        <LoginForm label="*E-Posta" value= {email} onChangeText={handleEmailChange}/>
        <LoginForm label='*Şifre' value= {password} onChangeText={handlePasswordChange} />
        </>
      ) : (
        <>
         <RegisterForm label='Ad' value = {name} onChangeText={handleNameChange} />
          <RegisterForm label='Soyad' value = {surname}  onChangeText={handleSurnameChange} />
          <LoginForm label="*E-Posta" value= {email} onChangeText={handleEmailChange}/>
         <LoginForm label='*Şifre' value= {password} onChangeText={handlePasswordChange} />
        </>
      )}</View>

        <TouchableOpacity className='w-[324px]  items-end '>
         <Text className='text-sm text-sm underline'>
        {tab==='login' ? '  Şifremi unuttum?' : ''}
          </Text>
        </TouchableOpacity>

 

      <TouchableOpacity 
      onPress={handleSubmit}
      className=' rounded-md mx-9 justify-center items-center mt-4 w-[324px] h-[55px] bg-black '>
        <Text className=' text-2xl semibold text-white text-center '>
           {tab === 'login' ? 'GİRİŞ YAP' : 'ÜYE OL'}
        </Text>
      </TouchableOpacity>

    </Wrapper>
    </SafeAreaView>
  )
}

export default LoginRegister;