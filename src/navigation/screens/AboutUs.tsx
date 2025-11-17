import { View, Text, SafeAreaView, ImageBackground, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import BackHeader from '../../components/TabsMenu/SSS/BackHeader'
import { useNavigation, useRoute } from '@react-navigation/native'
import ReviewSummary from '../../components/ReviewSummary'
import { CommentItem, getProductComments } from '../services/commentsService'

const AboutUs = () => {
  const navigation = useNavigation()
  const route = useRoute();
const productSlug = route?.params?.productSlug ?? null;
   const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

 useEffect(() => {
    loadComments();
  }, [page]);

 const loadComments = async () => {
    // offset hesaplama
    const offset = (page - 1) * pageSize;

    const { count, results } = await getProductComments(
      productSlug,
      pageSize,
      offset
    );

    setComments(results || []);
    setCommentsCount(count || 0);
  };


  return (
   <SafeAreaView className='flex-1 bg-white'>
    <ScrollView>
       <BackHeader 
          title='Hakkımızda'
          onPress={() => navigation.goBack()}
        />
        <View className='mx-5'>
           <Text className='font-semibold text-[22px] mt-12 '>
          Sağlıklı ve Fit Yaşamayı  
          {"\n"}Zevkli ve Kolay Hale  
          {"\n"}Getirmek İçin Varız     
         </Text>

         <Text className='text-[13.88px] font-normal mt-5 leading-6'>
          2016 yılından beri sporcu gıdaları, takviye edici gıdalar ve fonksiyonel gıdaları üreten bir firma olarak; müşterilerimize en kaliteli, lezzetli, tüketilmesi kolay ürünleri sunuyoruz. Müşteri memnuniyeti ve sağlığı her zaman önceliğimiz olmuştur. Ürünlerimizde, yüksek kalite standartlarına bağlı olarak,
           sporcuların ve sağlıklı yaşam tutkunlarının ihtiyaçlarına yönelik besleyici çözümler sunuyoruz.
          Ürün yelpazemizdeki protein tozları, aminoasitler, vitamin ve mineral takviyeleri ile spor performansınızı desteklemek için ideal besin değerlerini sunuyoruz. Sizin için sadece en iyisinin yeterli olduğunu biliyoruz. Bu nedenle, inovasyon, kalite,
          sağlık ve güvenlik ilkelerimizi korurken, sürekli olarak ürünlerimizi geliştirmeye ve yenilikçi beslenme çözümleri sunmaya devam ediyoruz.
        </Text>
        <Text className='text-[13.88px] font-normal mt-5 leading-6'>
          Sporcu gıdaları konusunda lider bir marka olarak, sizin sağlığınıza ve performansınıza değer veriyoruz.
          Siz de spor performansınızı en üst seviyeye çıkarmak ve sağlıklı yaşam tarzınızı desteklemek istiyorsanız, bize katılın ve en besleyici çözümlerimizle tanışın. Sağlıklı ve aktif bir yaşam için biz her zaman yanınızdayız.
        </Text>
        <Text className='text-[13.88px] font-normal mt-5 leading-6'>
          Sanatçılardan profesyonel sporculara, doktordan öğrencilere hayatın her alanında sağlıklı yaşamı ve
           beslenmeyi hedefleyen 1.000.000'den fazla kişiye ulaştık.
        </Text>
        

        <Text className='font-semibold text-[22px] mt-5'>Sertifikalarımız</Text> 
        <Text className=" leading-6 text-[13.88px] font-normal mt-3">Kalite politikamıza ulaşmak için tıklayın.</Text> 
        <Text className='leading-6 text-[13.88px] font-normal mt-5'>Firmamızın sahip olduğu sertifikalara aşağıdaki görsellere tıklayarak ulaşabilirsiniz.</Text>
    
       <View className='flex-row flex-wrap justify-between mx-2 mt-8'>
        <Image source={require('../../assets/1.png')}
        className="w-[100px] h-[100px] mb-4"
          resizeMode="contain"
        />

         <Image source={require('../../assets/2.png')}
        className="w-[100px] h-[100px] mb-4"
          resizeMode="contain"
        />

         <Image source={require('../../assets/3.png')}
        className="w-[100px] h-[100px] mb-4"
          resizeMode="contain"
        />

         <Image source={require('../../assets/4.png')}
        className="w-[100px] h-[100px] mb-4"
          resizeMode="contain"
        />

         <Image source={require('../../assets/5.png')}
        className="w-[100px] h-[100px] mb-4"
          resizeMode="contain"
        />

         <Image source={require('../../assets/6.png')}
        className="w-[100px] h-[100px] mb-4"
          resizeMode="contain"
        />
       </View>
        </View>

       {/* Yorumlar + dağılım + pagination */}
        <ReviewSummary
          comments={comments}
          totalCount={commentsCount}
          averageStarOverride={4.8}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
        />

       
    
    
    
    
    
    </ScrollView>
   </SafeAreaView>
  )
}

export default AboutUs

function fetchProductDetail(productId: any, page: number, pageSize: number) {
  throw new Error('Function not implemented.')
}
