import { View, Text, Image } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { MEDIA_BASE_URL } from '@env';
import ProductStars from './ProductStars';
import ProductPrice from './ProductPrice';


interface ProductCardProps {
 product:{
  id:string;
  name:string;
  short_explanation?:string;
  slug:string;
  comment_count:number;
  average_star:number;
  photo_src:string;
  price_info: {
    profit?:number | undefined;
    total_price:number; 
    discounted_price: number | null;
    discount_percentage: number | null;
  }

 }
}

const  ProductCard = ({ product }:ProductCardProps) => {
    const hasDiscount = product.price_info.discount_percentage !== null; 
    const finalPrice =  product.price_info.discounted_price ?? product.price_info.total_price;
        

  return (
    <View className='w-[179px] h-[344px] justify-center mx-auto'>
            <View className='items-center relative  '>
             <Image
              source={{uri: `${MEDIA_BASE_URL}${product.photo_src}`}}
              className='w-[150px] h-[150px]'
              resizeMode='cover'
             />  
              {hasDiscount && (
              <View className='absolute -top-4 -right-2 bg-red-500 px-2 py-1  w-[60px] h-[50px]'>
                <Text className='text-white text-center text-[19.69px] font-bold'> %{product.price_info.discount_percentage} <Text className='text-white text-center text-[11.25px]'> {"\n"}İNDİRİM</Text></Text>
              </View>
              )}
            </View>
          
        <View className='h-[175px]'>

            {/* Product Name */}
             <Text className='text-[18px] text-center font-bold mt-8 leading-tight tracking-tight' numberOfLines={2}>
              {product.name.toUpperCase()}
             </Text>
           
           {/* Short Explanation */}

           {product.short_explanation &&  (
            <Text className="text-gray-500 text-[10.5px] text-center mt-2 mx-6 h-8 w-[123.43]"
                  numberOfLines={2}>
            {product.short_explanation.toUpperCase()}
           </Text>
           )}

           {/* Stars */}
            <ProductStars rating={product.average_star} commentCount={product.comment_count} />
            </View>

            {/* Price Info */}
            <ProductPrice
            total={product.price_info.total_price}
            final={finalPrice}
            hasDiscount={hasDiscount}
            />

        </View>
  )
}

export default  ProductCard



