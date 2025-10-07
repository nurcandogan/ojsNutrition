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
import * as SplashScreen from "expo-splash-screen";
import CategoryProducts from './screens/CategoryProducts';



SplashScreen.preventAutoHideAsync();


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
     CategoryProducts: {
      screen: CategoryProducts,
      options: {
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

  // 🔸 Token kontrol fonksiyonu
  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    } catch (err) {
      console.log("Token kontrol hatası:", err);
      setIsLoggedIn(false);
    } finally {
      await SplashScreen.hideAsync(); // splash her durumda kapatılır
    }
  };

  useEffect(() => {
    checkToken();
    const interval = setInterval(checkToken, 1000); // 1 saniyede bir kontrol
    return () => clearInterval(interval);
  }, []);

  if (isLoggedIn === null) return null;

  const StackWithAuth = createNativeStackNavigator({
    screenOptions: { headerShown: false },
    screens: isLoggedIn
      ? { HomeTabs: { screen: HomeTabs }, 
          CategoryProducts: { screen: CategoryProducts },   //  buraya ekle!!
        }

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