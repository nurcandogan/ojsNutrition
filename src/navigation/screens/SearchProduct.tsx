import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { searchProducts } from "../services/searchService";
import SearchResultItem from "../../components/SearchResultItem";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { EvilIcons } from "@expo/vector-icons";

const SearchProduct = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {handleSearch()}, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const data = await searchProducts(query);
    setResults(data);
    //console.log('data', data)
    setLoading(false);
  };

  return (
    <SafeAreaView className=" bg-white " >
       <Image source={require('../../assets/ojslogo2.png')} className=' mx-6 w-32 h-16 ' resizeMode="contain"  />

      <View className=" flex-row items-center justify-between px-4 h-12 border-b border-lineColor bg-searchBg">
       <View className="flex-row items-center flex-1 h-9 mr-3  bg-searchBg  ">
         <EvilIcons name="search" size={20} color="black" />
        <TextInput
          placeholder="Ürün ara"
          placeholderTextColor='#000'
          className="flex-1 text-black ml-2 "
          value={query}
          onChangeText={setQuery}        // onChangeText={(text) => { setQuery(text);
          style={{                       //                setResults([]); }}. eski sonucları temizler 
          minHeight: 0,
          paddingVertical: 0,
        }}
        />

        <TouchableOpacity onPress={() => {
           setQuery("");
           setResults([]);
           setLoading(false);
           }}
        >
          <Text className="ml-3 text-[16px] text-logintext bg-searchBg ">Vazgeç</Text>
        </TouchableOpacity>
       </View>

        
      </View>

      <ScrollView className="px-6 bg-searchBg">
        {query.trim() !== "" && results.length > 0 && (
          <TouchableOpacity
            className="mb-3"
            onPress={() =>
              navigation.navigate('AllProducts' as never)
            }
          >
            <Text className="text-logintext mt-5">Tümünü Görüntüle</Text>
          </TouchableOpacity>
        )}

        {query.trim() !== "" && results.length === 0 && !loading && (
          <View className="mt-10 items-center">
            <Text className="text-gray-500">Aradığınız ürün bulunamadı.</Text>
          </View>
        )}

        {results.map((item: any) => (
          <SearchResultItem
            key={item.id}
            item={item}
            onPress={() =>
              navigation.navigate("ProductDetail", {
                slug: item.slug,
                name: item.name,
              })
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchProduct;
