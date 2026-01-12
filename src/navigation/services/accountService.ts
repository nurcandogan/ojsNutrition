import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env'; 



// Kullanıcı Bilgilerini Getir (GET)
export const getMyAccount = async () => {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) throw new Error("Oturum bulunamadı");

    const response = await fetch(`${API_BASE_URL}/users/my-account`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const json = await response.json();
    
    if (json.status === 'success') {
      return json.data;
    } else {
      throw new Error(json.message || 'Bilgiler alınamadı');
    }
  } catch (error) {
    throw error;
  }
};


// Kullanıcı Bilgilerini Güncelle (PUT)
export const updateMyAccount = async (data: any) => {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) throw new Error("Oturum bulunamadı");

    const response = await fetch(`${API_BASE_URL}/users/my-account`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (json.status === 'success') {
      return json.data;
    } else {
      throw new Error(json.message || 'Güncelleme başarısız');
    }
  } catch (error) {
    throw error;
  }
};