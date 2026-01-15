import { View, Text, SafeAreaView, Alert, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, Modal, FlatList, TextInput } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import PhoneField from '../../components/TabsMenu/Adress/PhoneField';
import SaveButton from '../../components/TabsMenu/Adress/SaveButton';
import DeleteButton from '../../components/TabsMenu/Adress/DeleteButton';
import Input from '../../components/TabsMenu/BizeUlasin/Input';
import AddressCard from '../../components/TabsMenu/Adress/AddressCard';
import { useAddressStore } from '../../store/addressStore';


import { 
  AddressProps, 
  fetchAddresses, 
  saveAddress, 
  deleteAddress, 
  fetchCities, 
  fetchDistricts, 
  CityItem, 
  DistrictItem 
} from '../services/addressService';

const AddressForm = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  
  // Checkout'tan geliyorsak seçim modu açık
  const isSelectionMode = !!route.params?.isSelectionMode;
  
  const { selectedAddressId, setSelectedAddressId } = useAddressStore();

  const [adresses, setAdresses] = useState<AddressProps[]>([]);
  const [loading, setLoading] = useState(true); // Başlangıçta true olsun
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showFirstTimeWarning, setShowFirstTimeWarning] = useState(false);
  
  const [addressToEdit, setAddressToEdit] = useState<AddressProps | null>(null);

  // Form Input State'leri
  const [adressName, setAdressName] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [adress, setAdress] = useState('');
  const [apartment, setApartment] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country] = useState({ cca2: "TR", callingCode: ["90"] });

  // Şehir & İlçe
  const [cities, setCities] = useState<CityItem[]>([]);
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityItem | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictItem | null>(null);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'CITY' | 'DISTRICT'>('CITY');
  const [searchText, setSearchText] = useState('');

  // 1. Verileri Çekme Fonksiyonu
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const addrRes = await fetchAddresses();
      setAdresses(addrRes);
      
      // Eğer hiç adres yoksa mecburen formu açacağız
      if (addrRes.length === 0) {
        setShowFirstTimeWarning(true); // Uyarıyı aç
        // Form açılırken şehirleri de yüklememiz lazım, bu işlemin bitmesini BEKLİYORUZ (await)
        await handleAddNewAddress(true); 
      } else {
        setShowFirstTimeWarning(false); // Adres varsa uyarıyı kapat
        setIsFormVisible(false); // Listeyi göster
      }

    } catch (error) {
      console.log(error);
    } finally {
      // Her şey (adres kontrolü ve gerekirse form hazırlığı) bittikten sonra loading'i kapat
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    loadInitialData();
  }, []));

  const ensureCitiesLoaded = async () => {
    if (cities.length > 0) return;
    try {
      // Eğer sayfa ilk açılış loading'i içindeyse ekstra form loading gösterme
      if(!loading) setLoadingForm(true); 
      const citiesRes = await fetchCities();
      setCities(citiesRes);
    } catch (error) {
      console.log("Şehirler çekilemedi", error);
    } finally {
      setLoadingForm(false);
    }
  };

  // 2. Yeni Adres Ekleme
  // isAutoTriggered: Bu fonksiyon kullanıcı butona basınca mı çalıştı yoksa sistem otomatik mi açtı?
  const handleAddNewAddress = async (isAutoTriggered = false) => {
    // Eğer kullanıcı butona bastıysa uyarıyı gösterme (sadece liste boşken otomatik açıldığında göster)
    if (!isAutoTriggered) {
        setShowFirstTimeWarning(false);
    }

    await ensureCitiesLoaded();
    resetForm();
    setIsFormVisible(true);
  };
  
  // 3. Düzenleme Modu
  const handleEditAddress = async (item: AddressProps) => {
    setShowFirstTimeWarning(false); // Düzenlemede uyarı görünmez
    await ensureCitiesLoaded();

    resetForm(item);
    
    const cityObj = { id: item.region.id, name: item.region.name };
    const districtObj = { id: item.subregion.id, name: item.subregion.name };
    
    setSelectedCity(cityObj);
    setSelectedDistrict(districtObj);
    
    try {
        const dists = await fetchDistricts(cityObj.name);
        setDistricts(dists);
    } catch (e) { console.log(e); }

    setIsFormVisible(true);
  };

  const resetForm = (item?: AddressProps) => {
    setAddressToEdit(item || null);
    setAdressName(item?.title || '');
    setName(item?.first_name || '');
    setSurname(item?.last_name || '');
    setAdress(item?.full_address || '');
    setApartment(''); 
    setPhoneNumber(item?.phone_number.replace('+90', '') || '');
    if (!item) {
        setSelectedCity(null);
        setSelectedDistrict(null);
        setDistricts([]);
    }
  };

  const handleSelectAddress = (item: AddressProps) => {
      if (isSelectionMode) {
          setSelectedAddressId(item.id);
          setTimeout(() => { navigation.goBack(); }, 350);
      }
  };

  const onSelectCity = async (city: CityItem) => {
    setSelectedCity(city);
    setSelectedDistrict(null);
    setModalVisible(false);
    setSearchText('');
    const dists = await fetchDistricts(city.name);
    setDistricts(dists);
  };

  const onSelectDistrict = (dist: DistrictItem) => {
    setSelectedDistrict(dist);
    setModalVisible(false);
    setSearchText('');
  };

  const handleDelete = async () => {
    if (!addressToEdit?.id) return;

    Alert.alert(
      "Adresi Sil",
      "Bu adresi silmek istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        { 
          text: "Sil", 
          style: "destructive", 
          onPress: async () => {
            try {
              setLoadingDelete(true);
              await deleteAddress(addressToEdit.id.toString());
              // Başarılı silme sonrası listeyi yenile
              await loadInitialData(); 
              // Formu kapat (loadInitialData içinde adres kalmadıysa otomatik tekrar açılacak ama mantık orada)
            } catch (error: any) {
              Alert.alert("Hata", error.message || "Silinemedi.");
            } finally {
              setLoadingDelete(false);
            }
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!adressName || !name || !surname || !adress || !selectedCity || !selectedDistrict || !phoneNumber) {
      Alert.alert("Uyarı", "Lütfen tüm zorunlu alanları doldurun");
      return;
    }

    setLoadingForm(true); 
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, "");
      const body = {
        title: adressName,  
        first_name: name,
        last_name: surname,
        country_id: 226, 
        region_id: selectedCity.id,
        subregion_id: selectedDistrict.id,
        full_address: adress,
        apartment: apartment,
        phone_number: `+90${cleanPhone}`
      };
      await saveAddress(body, addressToEdit?.id);
      
      Alert.alert(
          "Başarılı", 
          `Adres başarıyla ${addressToEdit ? 'güncellendi' : 'kaydedildi'}.`,
          [{ text: "Tamam", onPress: () => loadInitialData() }] // Kaydettikten sonra listeyi/formu yenile
      );
      
    } catch (error: any) {
      Alert.alert("Hata", error.message || "Bir sorun oluştu");
    } finally {
      setLoadingForm(false);
    }
  };
  
  const headerTitle = isFormVisible 
    ? (addressToEdit ? "Adresi Düzenle" : "Adres Oluştur") // Görsele uygun başlık
    : "Adreslerim";

  // Back tuşu işlevi: Eğer form açıksa ve adres listesi BOŞ DEĞİLSE geri döner, boşsa navigasyon geriye gider.
  const handleBackPress = () => {
      if (isFormVisible) {
          // Eğer adres listesi boşsa ve form açıksa, geri tuşu komple sayfadan çıkarır
          if (adresses.length === 0) {
              navigation.goBack();
          } else {
              // Adres listesi varsa forma geri döner
              setIsFormVisible(false);
              setShowFirstTimeWarning(false);
          }
      } else {
          navigation.goBack();
      }
  };

  const renderSelectionModal = () => {
    const data = modalType === 'CITY' ? cities : districts;
    const filteredData = data.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Modal visible={modalVisible} animationType="slide">
            <SafeAreaView className="flex-1 bg-white">
                <View className="px-4 py-4 flex-row items-center border-b border-gray-200 justify-between">
                    <Text className="text-lg font-bold">
                        {modalType === 'CITY' ? 'Şehir Seçiniz' : 'İlçe Seçiniz'}
                    </Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2">
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View className="p-4">
                    <TextInput 
                        className="bg-gray-100 p-3 rounded-lg text-black"
                        placeholder="Arama yap..."
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
                <FlatList 
                    data={filteredData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            className="p-4 border-b border-gray-100"
                            onPress={() => modalType === 'CITY' ? onSelectCity(item) : onSelectDistrict(item)}
                        >
                            <Text className="text-base text-black">{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </SafeAreaView>
        </Modal>
    );
  };

  // Full Screen Loading (Sadece ilk açılışta)
  if (loading && !isFormVisible) {
      return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center">
            <ActivityIndicator size="large" color="#2126AB" />
        </SafeAreaView>
      );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {renderSelectionModal()}
      
      <ScrollView 
        className="mb-10"
        refreshControl={!isFormVisible && <RefreshControl refreshing={loading} onRefresh={loadInitialData} />}
      >
        <BackHeader 
          title={headerTitle}
          onPress={handleBackPress}
        />

        {/* --- ADRES LİSTESİ --- */}
        {!isFormVisible && (
          <View className="px-4 mt-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-[20px] font-semibold">Adreslerim</Text>
              <TouchableOpacity onPress={() => handleAddNewAddress(false)}>
                <Text className="text-errortext font-semibold text-[16px]">Adres Ekle</Text>
              </TouchableOpacity>
            </View>

            {adresses.map((item) => (
              <AddressCard
                key={item.id}
                address={item}
                isSelectable={isSelectionMode} 
                isSelected={item.id === selectedAddressId}
                onSelect={() => handleSelectAddress(item)}
                onEdit={() => handleEditAddress(item)} 
              />
            ))}
          </View>
        )}

        {/* --- ADRES FORMU --- */}
        {isFormVisible && (
          <View>
             {/* YENİ: HİÇ ADRES YOKSA GÖSTERİLECEK UYARI KUTUSU */}
             {showFirstTimeWarning && (
                 <View className="mx-5 mt-5 p-4 bg-[#E6E6FA] border border-[#2126AB] rounded-md">
                     <Text className="text-[#2126AB] text-[13px] leading-5">
                         Kayıtlı bir adresiniz yok. Lütfen aşağıdaki kısımdan adres oluşturunuz.
                     </Text>
                 </View>
             )}

             {loadingForm ? (
                 <View className="h-60 justify-center items-center">
                     <ActivityIndicator size="large" color="#2126AB" />
                     <Text className="text-gray-500 mt-2">Form hazırlanıyor...</Text>
                 </View>
             ) : (
                <View className="mt-5">
                  <Input title="*Adres Başlığı" value={adressName} onChangeText={setAdressName} placeholder="ev, iş vb.." />
                  <Input title="*Ad" value={name} onChangeText={setName} placeholder="" />
                  <Input title="*Soyad" value={surname} onChangeText={setSurname} placeholder="" />
                  <Input title="*Adres" value={adress} onChangeText={setAdress} placeholder="" multiline />
                  <Input title="Apartman, Daire" value={apartment} onChangeText={setApartment} placeholder="" />
                  
                  <View className="mx-5 mb-4 mt-4">
                      <Text className=" mb-3 text-[13.75px] font-medium">*Şehir</Text>
                      <TouchableOpacity 
                        onPress={() => { setModalType('CITY'); setModalVisible(true); }}
                        className="border border-bordergray  w-[358px] h-[50px] rounded-[4px] p-3 bg-commentBg flex-row justify-between items-center"
                      >
                          <Text className={selectedCity ? "text-black" : "text-gray-400"}>
                              {selectedCity ? selectedCity.name : "Şehir Seçiniz"}
                          </Text>
                          <Feather name="chevron-down" size={20} color="gray" />
                      </TouchableOpacity>
                  </View>

                  <View className="mx-5 mb-4 mt-4">
                      <Text className=" mb-3 text-[13.75px] font-medium">*İlçe</Text>
                      <TouchableOpacity 
                        onPress={() => { 
                            if(!selectedCity) { Alert.alert("Uyarı", "Önce şehir seçiniz."); return; }
                            setModalType('DISTRICT'); 
                            setModalVisible(true); 
                        }}
                        className="border border-bordergray  w-[358px] h-[50px] rounded-[4px] p-3 bg-commentBg flex-row justify-between items-center"
                      >
                          <Text className={selectedDistrict ? "text-black" : "text-gray-400"}>
                              {selectedDistrict ? selectedDistrict.name : "İlçe Seçiniz"}
                          </Text>
                          <Feather name="chevron-down" size={20} color="gray" />
                      </TouchableOpacity>
                  </View>

                  <PhoneField value={phoneNumber} onChange={setPhoneNumber} country={country} setCountry={() => {}} />
                </View>
             )}
            
            {/* Buton Alanı */}
            {!loadingForm && (
                <View className="flex-row justify-end items-center mx-5 mt-14 mb-10">
                  {addressToEdit && (
                    <DeleteButton 
                      loading={loadingDelete} 
                      onPress={handleDelete} 
                    />
                  )}
                  <SaveButton 
                    loading={loadingForm} 
                    onPress={handleSave} 
                  />
                </View>
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default AddressForm;