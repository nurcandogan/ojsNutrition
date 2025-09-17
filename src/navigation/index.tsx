import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HeaderButton, Text } from '@react-navigation/elements';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Image, View } from 'react-native';
import bell from '../assets/bell.png';
import newspaper from '../assets/newspaper.png';
import SearchProduct from './screens/SearchProduct';
import AllProducts from './screens/AllProducts';
import Menu from './screens/Menu';
import Home from './screens/Home';
import LoginRegister from './screens/LoginRegister';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';




const HomeTabs = createBottomTabNavigator({
   screenOptions: {
    headerShown: false,
  },
  screens: {
    Home: {
      screen: Home,
      options: {
        title: 'Anasayfa',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={newspaper}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
    SearchProduct: {
      screen: SearchProduct,
      title: 'Ürün Ara',
      options: {
        tabBarIcon: ({ color, size }) => (
          <Image
            source={bell}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
    AllProducts: {
      screen: AllProducts,
      options: {
        title: 'Tüm Ürünler',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={newspaper}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
 
    Menu: {
      screen: Menu,
      options: {
        title: 'Menü',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={newspaper}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Login: {
      screen: LoginRegister,
      options: {
        //title: 'Home',
        headerShown: false,
      },
    },
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: 'Home',
        headerShown: false,
      },
    },
  }})


    
// ------------------- Navigation Wrapper -------------------
function RootNavigation() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      setIsLoggedIn(!!token);

      //  token kontrolü bittikten sonra splash'ı kapat
      await SplashScreen.hideAsync();
    };

    checkToken();
  }, []);

  if (isLoggedIn === null) {
    //  spinner yok → sadece splash ekranda kalıyor
    return null;
  }


  // Login olmuşsa direkt HomeTabs, olmamışsa Login
  const StackWithAuth = createNativeStackNavigator({
    screenOptions: { headerShown: false },
    screens: isLoggedIn
      ? { HomeTabs: { screen: HomeTabs } }
      : { Login: { screen: LoginRegister } },
  });

  const Navigation = createStaticNavigation(StackWithAuth);
  return <Navigation />;
}


export const Navigation = RootNavigation;

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}