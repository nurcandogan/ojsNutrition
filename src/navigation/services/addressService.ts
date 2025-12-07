import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AddressProps {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  full_address: string;
  phone_number: string;
  country: { id: number; name: string };
  region: { id: number; name: string };     // Şehir
  subregion: { id: number; name: string };  // İlçe
}

export interface CityItem {
  id: number;
  name: string;
}

export interface DistrictItem {
  id: number;
  name: string;
}

/** Kayıtlı adresleri backend'den çeker (GET) */
export async function fetchAddresses(): Promise<AddressProps[]> {
  try { 
    const token = await AsyncStorage.getItem("access_token");
    if (!token) return [];

    const response = await fetch(`${API_BASE_URL}/users/addresses?limit=10&offset=0`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });
    const json = await response.json();
    
    if (json?.status === 'success' && json?.data?.results) {
        return json.data.results as AddressProps[];
    }
    return [];
  } catch (error) {
    console.error("Adres çekme hatası:", error);
    return [];
  }
}

/** * Yeni adres kaydeder (POST) veya Mevcut adresi günceller (PUT) 
 * @param body Gönderilecek veri
 * @param updateId Eğer güncelleme ise adresin ID'si, yoksa undefined
 */
export async function saveAddress(body: any, updateId?: string): Promise<boolean> {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) throw new Error("Oturum bulunamadı");

    // 🔥 GÜNCELLEME MANTIĞI BURADA:
    // Eğer updateId varsa URL sonuna ekle ve metod PUT olsun. Yoksa POST.
    const url = updateId 
        ? `${API_BASE_URL}/users/addresses/${updateId}` 
        : `${API_BASE_URL}/users/addresses`;

    const method = updateId ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return true;
    } else {
      const json = await response.json();
      const errorMessage = json.message || (json.reason ? JSON.stringify(json.reason) : "İşlem başarısız");
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Adres kaydetme hatası:", error);
    throw error;
  }
}

/** Tüm Şehirleri Getir */
export async function fetchCities(): Promise<CityItem[]> {
  try {
    const token = await AsyncStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/world/region?limit=1000&offset=0&country-name=turkey`, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    const json = await response.json();
    if (json?.status === 'success' && json?.data?.results) return json.data.results;
    return [];
  } catch (error) { return []; }
}

/** İlçeleri Getir */
export async function fetchDistricts(cityName: string): Promise<DistrictItem[]> {
  try {
    const token = await AsyncStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/world/subregion?limit=1000&offset=0&region-name=${cityName}`, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    const json = await response.json();
    if (json?.status === 'success' && json?.data?.results) return json.data.results;
    return [];
  } catch (error) { return []; }
}