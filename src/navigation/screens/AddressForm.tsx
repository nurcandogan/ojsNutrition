import { View, Text, SafeAreaView, Alert, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, Modal, FlatList, TextInput } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import PhoneField from '../../components/TabsMenu/Adress/PhoneField';
import SaveButton from '../../components/TabsMenu/Adress/SaveButton';
import Input from '../../components/TabsMenu/BizeUlasin/Input';
import AddressCard from '../../components/TabsMenu/Adress/AddressCard';
import { useAddressStore } from '../../store/addressStore';

// Servisler
import { 
  AddressProps, 
  fetchAddresses, 
  saveAddress, 
  fetchCities, 
  fetchDistricts, 
  CityItem, 
  DistrictItem 
} from '../services/addressService';

const AddressForm = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isSelectionMode = route.params?.isSelectionMode || false;
  const { selectedAddressId, setSelectedAddressId } = useAddressStore();

  const [adresses, setAdresses] = useState<AddressProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Düzenlenecek adresin tamamını tutar
  const [addressToEdit, setAddressToEdit] = useState<AddressProps | null>(null);

  // Form Input State'leri
  const [adressName, setAdressName] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [adress, setAdress] = useState('');
  const [apartment, setApartment] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country] = useState({ cca2: "TR", callingCode: ["90"] });

  // Şehir & İlçe Seçimi
  const [cities, setCities] = useState<CityItem[]>([]);
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityItem | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictItem | null>(null);

  // Modal Ayarları
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'CITY' | 'DISTRICT'>('CITY');
  const [searchText, setSearchText] = useState('');

  // 1. Verileri Yükle
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [addrRes, citiesRes] = await Promise.all([
        fetchAddresses(),
        fetchCities()
      ]);
      setAdresses(addrRes);
      setCities(citiesRes);
      
      // Hiç adres yoksa ekleme ekranını aç
      if (addrRes.length === 0) {
        handleAddNewAddress();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    loadInitialData();
  }, []));

  // 2. Yeni Adres Ekleme Modu
  const handleAddNewAddress = () => {
    resetForm();
    setIsFormVisible(true);
  };
  
  // 3. Düzenleme Modu (Verileri Doldur)
  const handleEditAddress = async (item: AddressProps) => {
    resetForm(item); // Inputları doldur
    
    // Backend'den gelen mevcut şehir ve ilçeyi state'e set et
    const cityObj = { id: item.region.id, name: item.region.name };
    const districtObj = { id: item.subregion.id, name: item.subregion.name };
    
    setSelectedCity(cityObj);
    setSelectedDistrict(districtObj);
    
    // Şehir seçili olduğu için o şehrin ilçelerini de hemen yükle (kullanıcı değiştirmek isterse diye)
    const dists = await fetchDistricts(cityObj.name);
    setDistricts(dists);

    setIsFormVisible(true);
  };

  const resetForm = (item?: AddressProps) => {
    setAddressToEdit(item || null); // Eğer item varsa düzenleme modudur
    setAdressName(item?.title || '');
    setName(item?.first_name || '');
    setSurname(item?.last_name || '');
    setAdress(item?.full_address || '');
    setApartment(''); 
    setPhoneNumber(item?.phone_number.replace('+90', '') || '');
    
    if (!item) {
        // Yeni ekleme ise seçimleri sıfırla
        setSelectedCity(null);
        setSelectedDistrict(null);
        setDistricts([]);
    }
  };

  // Adres Seçimi (Checkout için)
  const handleSelectAddress = (item: AddressProps) => {
      if (isSelectionMode) {
          setSelectedAddressId(item.id);
          setTimeout(() => { navigation.goBack(); }, 350);
      }
  };

  // Modal Seçimleri
  const onSelectCity = async (city: CityItem) => {
    setSelectedCity(city);
    setSelectedDistrict(null); // Şehir değişirse ilçe sıfırlanır
    setModalVisible(false);
    setSearchText('');
    
    // İlçeleri çek
    const dists = await fetchDistricts(city.name);
    setDistricts(dists);
  };

  const onSelectDistrict = (dist: DistrictItem) => {
    setSelectedDistrict(dist);
    setModalVisible(false);
    setSearchText('');
  };

  // 4. KAYDETME BUTONU
  const handleSave = async () => {
    if (!adressName || !name || !surname || !adress || !selectedCity || !selectedDistrict || !phoneNumber) {
      Alert.alert("Uyarı", "Lütfen tüm zorunlu alanları doldurun");
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, "");
      
      const body = {
        title: adressName,  
        first_name: name,
        last_name: surname,
        country_id: 226, 
        region_id: selectedCity.id,       // Şehir ID
        subregion_id: selectedDistrict.id,// İlçe ID
        full_address: adress,
        apartment: apartment,
        phone_number: `+90${cleanPhone}`
      };

      // 🔥 KİLİT NOKTA: 
      // addressToEdit varsa onun ID'sini gönderiyoruz (PUT oluyor).
      // Yoksa ID göndermiyoruz (POST oluyor).
      await saveAddress(body, addressToEdit?.id);

      Alert.alert("Başarılı", `Adres başarıyla ${addressToEdit ? 'güncellendi' : 'kaydedildi'}.`);
      
      setIsFormVisible(false); 
      resetForm(); 
      loadInitialData(); // Listeyi yenile
    } catch (error: any) {
      Alert.alert("Hata", error.message || "Bir sorun oluştu");
    }
    setLoading(false);
  };
  
  // Başlık Ayarı
  const headerTitle = isFormVisible 
    ? (addressToEdit ? "Adresi Düzenle" : "Yeni Adres Ekle")
    : "Adreslerim";

  // --- SEÇİM MODALI ---
  const renderSelectionModal = () => {
    const data = modalType === 'CITY' ? cities : districts;
    const filteredData = data.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Modal visible={modalVisible} animationType="slide">
            <SafeAreaView className="flex-1 bg-white">
                {/* Modal Header */}
                <View className="px-4 py-4 flex-row items-center border-b border-gray-200 justify-between">
                    <Text className="text-lg font-bold">
                        {modalType === 'CITY' ? 'Şehir Seçiniz' : 'İlçe Seçiniz'}
                    </Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2">
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Arama */}
                <View className="p-4">
                    <TextInput 
                        className="bg-gray-100 p-3 rounded-lg text-black"
                        placeholder="Arama yap..."
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                {/* Liste */}
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

  if (loading && adresses.length === 0 && !isFormVisible) {
      return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center">
            <ActivityIndicator size="large" color="#4F46E5" />
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
          onPress={() => isFormVisible ? setIsFormVisible(false) : navigation.goBack()}
        />

        {/* --- ADRES LİSTESİ --- */}
        {!isFormVisible && (
          <View className="px-4 mt-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-[20px] font-semibold">Adreslerim</Text>
              <TouchableOpacity onPress={handleAddNewAddress}>
                <Text className="text-orange-500 font-semibold text-[16px]">Adres Ekle</Text>
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
            <View className="mt-10">
              <Input title="*Adres Başlığı" value={adressName} onChangeText={setAdressName} placeholder="ev, iş vb.." />
              <Input title="*Ad" value={name} onChangeText={setName} placeholder="" />
              <Input title="*Soyad" value={surname} onChangeText={setSurname} placeholder="" />
              <Input title="*Adres" value={adress} onChangeText={setAdress} placeholder="" multiline />
              <Input title="Apartman, Daire" value={apartment} onChangeText={setApartment} placeholder="" />
              
              {/* ŞEHİR SEÇİMİ */}
              <View className="mx-5 mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-1">*Şehir</Text>
                  <TouchableOpacity 
                    onPress={() => { setModalType('CITY'); setModalVisible(true); }}
                    className="border border-gray-300 rounded-lg p-3 bg-white flex-row justify-between items-center"
                  >
                      <Text className={selectedCity ? "text-black" : "text-gray-400"}>
                          {selectedCity ? selectedCity.name : "Şehir Seçiniz"}
                      </Text>
                      <Feather name="chevron-down" size={20} color="gray" />
                  </TouchableOpacity>
              </View>

              {/* İLÇE SEÇİMİ */}
              <View className="mx-5 mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-1">*İlçe</Text>
                  <TouchableOpacity 
                    onPress={() => { 
                        if(!selectedCity) { Alert.alert("Uyarı", "Önce şehir seçiniz."); return; }
                        setModalType('DISTRICT'); 
                        setModalVisible(true); 
                    }}
                    className="border border-gray-300 rounded-lg p-3 bg-white flex-row justify-between items-center"
                  >
                      <Text className={selectedDistrict ? "text-black" : "text-gray-400"}>
                          {selectedDistrict ? selectedDistrict.name : "İlçe Seçiniz"}
                      </Text>
                      <Feather name="chevron-down" size={20} color="gray" />
                  </TouchableOpacity>
              </View>

              <PhoneField value={phoneNumber} onChange={setPhoneNumber} country={country} setCountry={() => {}} />
            </View>
            
            <View className="items-end mx-5 mt-14">
              <SaveButton loading={loading} onPress={handleSave} />
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default AddressForm;