
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createStaticNavigation,
  StaticParamList
} from '@react-navigation/native';
import { Image } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from "expo-splash-screen";

import Home from './screens/Home';
import SearchProduct from './screens/SearchProduct';
import AllProducts from './screens/AllProducts';
import Menu from './screens/Menu';
import LoginRegister from './screens/LoginRegister';
import ProductDetail from './screens/ProductDetail';
import ProductList from './screens/ProductList';
import AccountInfo from './screens/AccountInfo';
import Orders from './screens/Orders';
import AddressForm from './screens/AddressForm';
import AboutUs from './screens/AboutUs';
import ContactUs from './screens/ContactUs';
import Sss from './screens/Sss';
import Basket from './screens/Basket';

import bell from '../assets/bell.png';
import newspaper from '../assets/newspaper.png';

SplashScreen.preventAutoHideAsync();

/* ----------------------- 1) TABS ------------------------- */

const BottomTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Home: {
      screen: Home,
      options: {
        title: "Anasayfa",
        tabBarIcon: ({ color, size }) => (
          <Image source={newspaper} tintColor={color} style={{ width: size, height: size }} />
        )
      }
    },

    SearchProduct: {
      screen: SearchProduct,
      options: {
        title: "Ürün Ara",
        tabBarIcon: ({ color, size }) => (
          <Image source={bell} tintColor={color} style={{ width: size, height: size }} />
        )
      }
    },

    AllProducts: {
      screen: AllProducts,
      options: {
        title: "Tüm Ürünler",
        tabBarIcon: ({ color, size }) => (
          <Image source={newspaper} tintColor={color} style={{ width: size, height: size }} />
        )
      }
    },

    Menu: {
      screen: Menu,
      options: {
        title: "Menü",
        tabBarIcon: ({ color, size }) => (
          <Image source={newspaper} tintColor={color} style={{ width: size, height: size }} />
        )
      }
    }
  }
});

/* ----------------------- 2) AUTH & APP STACK ------------------------- */

// 🎯 Bu stack'ler component DIŞINDA TANIMLANIR → her render’da yeniden oluşturulmaz!

const AppStack = createNativeStackNavigator({
  screenOptions: { headerShown: false },
  screens: {
    HomeTabs: { screen: BottomTabs },
    ProductList: { screen: ProductList },
    ProductDetail: { screen: ProductDetail },
    Basket: { screen: Basket },
    AccountInfo: { screen: AccountInfo },
    AddressForm: { screen: AddressForm },
    Orders: { screen: Orders },
    AboutUs: { screen: AboutUs },
    ContactUs: { screen: ContactUs },
    Sss: { screen: Sss }
  }
});

const AuthStack = createNativeStackNavigator({
  screenOptions: { headerShown: false },
  screens: {
    Login: { screen: LoginRegister }
  }
});

// 🎯 Navigation instance’ları da DIŞARIDA olmalı
const AppNavigation = createStaticNavigation(AppStack);
const AuthNavigation = createStaticNavigation(AuthStack);


/* ----------------------- 3) ROOT NAVIGATION ------------------------- */

export default function RootNavigation() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('access_token');
    setIsLoggedIn(!!token);

    await SplashScreen.hideAsync();
  };

  useEffect(() => {
    checkToken(); // sadece 1 kere çalışır
  }, []);

  if (isLoggedIn === null) return null; // splash ekranı bekler

  return isLoggedIn ? <AppNavigation /> : <AuthNavigation />;
}

/* --------------------- Type Tanımları ------------------ */

type RootStackParamList = StaticParamList<typeof AppStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
