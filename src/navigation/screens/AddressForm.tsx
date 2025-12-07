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

// Servisler
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
  const [loading, setLoading] = useState(false);        // Sayfa açılış loading'i
  const [loadingForm, setLoadingForm] = useState(false); // Form açılırken verileri çekme loading'i
  const [loadingDelete, setLoadingDelete] = useState(false);
  
  const [isFormVisible, setIsFormVisible] = useState(false);
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

  // 1. OPTİMİZE EDİLDİ: Sadece adresleri çeker (Çok hızlı açılır)
  const loadInitialData = async () => {
    setLoading(true);
    try {
      // SADECE ADRESLERİ ÇEKİYORUZ, ŞEHİRLERİ DEĞİL
      const addrRes = await fetchAddresses();
      setAdresses(addrRes);
      
      // Eğer hiç adres yoksa mecburen formu açacağız
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

  // YARDIMCI: Şehirleri sadece ihtiyaç anında çeker
  const ensureCitiesLoaded = async () => {
    if (cities.length > 0) return; // Zaten çekildiyse tekrar çekme
    
    try {
      setLoadingForm(true); // Ufak bir bekleme gösterilebilir
      const citiesRes = await fetchCities();
      setCities(citiesRes);
    } catch (error) {
      console.log("Şehirler çekilemedi", error);
    } finally {
      setLoadingForm(false);
    }
  };

  // 2. Yeni Adres Ekleme
  const handleAddNewAddress = async () => {
    // Önce şehir verisi var mı kontrol et, yoksa çek
    await ensureCitiesLoaded();
    
    resetForm();
    setIsFormVisible(true);
  };
  
  // 3. Düzenleme Modu
  const handleEditAddress = async (item: AddressProps) => {
    // Önce şehir verisi var mı kontrol et, yoksa çek
    await ensureCitiesLoaded();

    resetForm(item);
    
    // Düzenlenen adresin şehir ve ilçe bilgilerini hazırla
    const cityObj = { id: item.region.id, name: item.region.name };
    const districtObj = { id: item.subregion.id, name: item.subregion.name };
    
    setSelectedCity(cityObj);
    setSelectedDistrict(districtObj);
    
    // Seçili şehrin ilçelerini çek
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
              Alert.alert("Başarılı", "Adres başarıyla silindi.");
              setIsFormVisible(false);
              resetForm();
              loadInitialData();
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

    // Formu kilitliyoruz (loading)
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
      Alert.alert("Başarılı", `Adres başarıyla ${addressToEdit ? 'güncellendi' : 'kaydedildi'}.`);
      setIsFormVisible(false); 
      resetForm(); 
      loadInitialData();
    } catch (error: any) {
      Alert.alert("Hata", error.message || "Bir sorun oluştu");
    } finally {
      setLoadingForm(false);
    }
  };
  
  const headerTitle = isFormVisible 
    ? (addressToEdit ? "Adresi Düzenle" : "Yeni Adres Ekle")
    : "Adreslerim";

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

  // Eğer ilk yüklemede adresler çekiliyorsa loading göster
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
             {/* FORM AÇILIRKEN ŞEHİRLER YÜKLENİYORSA LOADING GÖSTER */}
             {loadingForm ? (
                 <View className="h-60 justify-center items-center">
                     <ActivityIndicator size="large" color="#4F46E5" />
                     <Text className="text-gray-500 mt-2">Form verileri hazırlanıyor...</Text>
                 </View>
             ) : (
                <View className="mt-10">
                  <Input title="*Adres Başlığı" value={adressName} onChangeText={setAdressName} placeholder="ev, iş vb.." />
                  <Input title="*Ad" value={name} onChangeText={setName} placeholder="" />
                  <Input title="*Soyad" value={surname} onChangeText={setSurname} placeholder="" />
                  <Input title="*Adres" value={adress} onChangeText={setAdress} placeholder="" multiline />
                  <Input title="Apartman, Daire" value={apartment} onChangeText={setApartment} placeholder="" />
                  
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
             )}
            
            {/* Buton Alanı (Form Yüklenirken Gizlenebilir veya Disabled Olabilir) */}
            {!loadingForm && (
                <View className="flex-row justify-end items-center mx-5 mt-14 mb-10">
                  {addressToEdit && (
                    <DeleteButton 
                      loading={loadingDelete} 
                      onPress={handleDelete} 
                    />
                  )}
                  <SaveButton 
                    loading={loadingForm} // Kaydederken de bu loading kullanılabilir veya ayrı tutulur
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