import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Eklendi

// Ekranlar
import SearchProduct from './screens/SearchProduct';
import AllProducts from './screens/AllProducts';
import Menu from './screens/Menu';
import Home from './screens/Home';
import LoginRegister from './screens/LoginRegister';
import ProductDetail from './screens/ProductDetail';
import ProductList from './screens/ProductList';
import AccountInfo from './screens/AccountInfo';
import AddressForm from './screens/AddressForm';
import AboutUs from './screens/AboutUs';
import ContactUs from './screens/ContactUs';
import Sss from './screens/Sss';
import Basket from './screens/Basket';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderSuccessScreen from './screens/OrderSuccessScreen';
import Orders from './screens/Orders';
import OrderDetailScreen from './screens/OrderDetailScreen';

// İkonlar
import HomeTabsIcon from '../Svgs/HomeTabsIcon';
import SearchTabs from '../Svgs/SearchTabs';
import AllTabs from '../Svgs/AllTabs';
import MenuTabs from '../Svgs/MenuTabs';

SplashScreen.preventAutoHideAsync();

const HomeTabs = createBottomTabNavigator({
   screenOptions: {
    headerShown: false,
    tabBarStyle: { height: 90 },
    tabBarActiveTintColor: "#000",
    tabBarInactiveTintColor: "#9E9E9E",
    tabBarLabelStyle: { fontSize: 12.91 },
    tabBarItemStyle: { justifyContent: "center", alignItems: "center", paddingVertical: 10 },
  },
  screens: {
    Home: { screen: Home, options: { title: 'Anasayfa', tabBarIcon: ({ color }) => <HomeTabsIcon color={color}/> }},
    SearchProduct: { screen: SearchProduct, options: { title: 'Ürün Ara', tabBarIcon: ({ color }) => <SearchTabs/> }},
    AllProducts: { screen: AllProducts, options: { title: 'Tüm Ürünler', tabBarIcon: ({ color }) => <AllTabs/> }},
    Menu: { screen: Menu, options: { title: 'Menü', tabBarIcon: ({ color }) => <MenuTabs/> }},
  },
});

// TÜM SAYFALAR TEK BİR LİSTEDE
const MainStack = createNativeStackNavigator({
  initialRouteName: "HomeTabs", // Açılış sayfası KESİNLİKLE Anasayfa
  screenOptions: { headerShown: false },
  screens: {
    HomeTabs: { screen: HomeTabs },
    Login: { screen: LoginRegister },
    Basket: { screen: Basket },
    CheckoutScreen: { screen: CheckoutScreen },
    AllProductsStack: { screen: AllProducts },
    ProductList: { screen: ProductList },
    ProductDetail: { screen: ProductDetail },
    OrderSuccessScreen: { screen: OrderSuccessScreen },
    AccountInfo: { screen: AccountInfo },
    AddressForm: { screen: AddressForm },
    AboutUs: { screen: AboutUs },
    ContactUs: { screen: ContactUs },
    Sss: { screen: Sss },
    Orders: { screen: Orders },
    OrderDetailScreen: { screen: OrderDetailScreen }
  }
});

function RootNavigation() {
  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.hideAsync();
    };
    prepare();
  }, []);

  const Navigation = createStaticNavigation(MainStack);
  return <Navigation />;
}

export const Navigation = RootNavigation;

type RootStackParamList = StaticParamList<typeof MainStack>;
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}