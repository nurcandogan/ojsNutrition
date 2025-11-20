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
import ProductDetail from './screens/ProductDetail';
import ProductList from './screens/ProductList';
import AccountInfo from './screens/AccountInfo';
import Orders from './screens/Orders';
import AddressForm from './screens/AddressForm';
import AboutUs from './screens/AboutUs';
import ContactUs from './screens/ContactUs';
import Sss from './screens/Sss';
import Basket from './screens/Basket';
import HomeTabsIcon from '../Svgs/HomeTabsIcon';
import { SearchBar } from 'react-native-screens';
import SearchTabs from '../Svgs/SearchTabs';
import AllTabs from '../Svgs/AllTabs';
import MenuTabs from '../Svgs/MenuTabs';




SplashScreen.preventAutoHideAsync();


const HomeTabs = createBottomTabNavigator({
   screenOptions: {
    headerShown: false,

    tabBarStyle: {
       height: 90,
    },

    tabBarActiveTintColor: "#000",     //title color
    tabBarInactiveTintColor: "#9E9E9E",

    tabBarLabelStyle: {
      fontSize: 12.91,
      
    },

    tabBarItemStyle: {
      justifyContent: "center",   // 📌 Dikeyde ortalama
      alignItems: "center",
      paddingVertical: 10,    
      
    },
  
  },


  screens: {
    Home: {
      screen: Home,
      options: {
        title: 'Anasayfa',
        tabBarIcon: ({ color, size }) => (
         <HomeTabsIcon color={color}/>
        ),
      },
    },

    SearchProduct: {
      screen: SearchProduct,
      options: {
        title: 'Ürün Ara',
        tabBarIcon: ({ color, size }) => (
          <SearchTabs/>
        ),
      },
    },
    AllProducts: {
      screen: AllProducts,
      options: {
        title: 'Tüm Ürünler',
        tabBarIcon: ({ color, size }) => (
          <AllTabs/>
        ),
      },
    },
 
    Menu: {
      screen: Menu,
      options: {
        title: 'Menü',
        tabBarIcon: ({ color, size }) => (
          <MenuTabs/>
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
     ProductList: {
      screen: ProductList,
      options: {
        headerShown: false,
      },
    },
     ProductDetail: {
      screen: ProductDetail,
      options: {
        headerShown: false,
      },
    },
    Basket: {
      screen: Basket,
      options: {
        headerShown: false,
      },
    },
    
    HomeTabs: {
      screen: HomeTabs,
      options: {
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
      const token = await AsyncStorage.getItem('access_token');
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
          ProductList: { screen: ProductList },   
          ProductDetail: { screen: ProductDetail  },  
          Basket:       { screen: Basket },
          AccountInfo:  { screen: AccountInfo },
          AddressForm:  { screen: AddressForm },
          Orders:       { screen: Orders },
          AboutUs:      { screen: AboutUs },
          ContactUs:    { screen: ContactUs },
          Sss:          { screen: Sss },
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