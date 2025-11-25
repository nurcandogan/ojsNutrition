import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export interface AddressProps {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  full_address: string;
  phone_number: string;
  country: { id: number; name: string };
  region: { id: number; name: string };
  subregion: { id: number; name: string };
}

/** Kayıtlı adresleri backend'den çeker (GET) */
export async function fetchAddresses(): Promise<AddressProps[]> {
  try { const token = await AsyncStorage.getItem("access_token");
    if (!token) return [];

    const response = await fetch(`${API_BASE_URL}/users/addresses?limit=10&offset=0`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });
    const json = await response.json();
    
    if (json?.status === 'success' && json?.data?.results) {
        return json.data.results as AddressProps[];
    }
    
    console.error("Adres çekme API yanıtı başarısız:", json);
    return [];

  } catch (error) {
    console.error("Adres çekme genel hatası:", error);
    return [];
  }
}

/** Yeni adres kaydeder veya düzenler (POST) */
export async function saveAddress(body: any): Promise<boolean> {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) throw new Error("Oturum bulunamadı");

    const response = await fetch(`${API_BASE_URL}/users/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
//      Alert.alert("Başarılı ", "Adres kaydedildi");
        
      return true;
    } else {
      const json = await response.json();
      const errorMessage = json.message || json.reason ? Object.values(json.reason).flat().join("\n") : "Adres kaydedilemedi";
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Adres kaydetme genel hatası:", error);
    throw error;
  }
}