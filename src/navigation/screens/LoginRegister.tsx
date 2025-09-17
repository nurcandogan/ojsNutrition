/** @format */

import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView, Modal, Alert } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import LoginForm from "../../components/LoginForm";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import RegisterForm from "../../components/RegisterForm";
import { Feather } from "@expo/vector-icons";
import { kvkkAydinlatmaMetni } from "../../constant/legal/Kvkk";
import { MembershipAgreement } from "../../constant/legal/MembershipAgreement";
import * as Yup from "yup";
import { FormikProps } from "formik";
import { loginService, registerService } from "../services/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';



const loginSchema = Yup.object().shape({
	username: Yup.string().email("Geçerli bir e-posta adresi girin").required("Girilen bilgiler hatalı!"),
	password: Yup.string().min(6, "Girilen bilgiler hatalı!	").required("Şifre en az 6 karakter olmalıdır."),
});
 const registerSchema = Yup.object().shape({
	first_name: Yup.string().required("Başka bir ad girin."),
	email: Yup.string().email("Geçerli bir e-posta adresi girin").required("Bu e-posta zaten alınmış."),	
	password: Yup.string().min(6, "Şifrenizde ()(/&%+^'!)  bulundurun.").required("Şifre gerekli"),
	password2: Yup.string()
		.oneOf([Yup.ref("password"), ''], "Şifreler eşleşmiyor")
		.required("Şifre tekrarı gerekli"),
	isCheck:     Yup.boolean().oneOf([true], 'Kampanya onayı gerekli.'),
    secondCheck: Yup.boolean().oneOf([true], 'Sözleşmeyi onaylayın.'),	
});



const LoginRegister = () => {
	const navigation = useNavigation();
	const [tab, setTab] = useState<"login" | "register">("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [isCheck, setIsCheck] = useState(false);
	const [secondCheck, setSecondCheck] = useState(false);
	const [showContractModal, setShowContractModal] = useState(false); //sözleşmeler
	const [showKVKKModal, setShowKVKKModal] = useState(false); //kvkk
	const [errors, setErrors] = useState<Record<string,string>>({}) //hatalar



	useFocusEffect(
		useCallback(() => {
			
			setEmail("");
			setPassword("");
			setName("");
			setSurname("");
			setIsCheck(false);
			setSecondCheck(false);
		    setErrors({});
				
		}, [tab])
	);

	const handleEmailChange = (text: string) => setEmail(text);
	const handlePasswordChange = (text: string) => setPassword(text);
	const handleNameChange = (text: string) => setName(text);
	const handleSurnameChange = (text: string) => setSurname(text);

	const Wrapper = tab === "register" ? ScrollView : View;
	const WrapperStyle = {
		alignItems: "center" as const,
		paddingBottom: 40,
	};

	const handleSubmit = async() => {
		setErrors({}); 
		if (tab === "login") {
			console.log("Login:", { email, password });

			try {
				await loginSchema.validate({ username: email, password }, { abortEarly: false });
				const res = await loginService(email, password);
			    console.log("API Cevabı:", res);
				if (!res.success) {
				Alert.alert("Giriş Hatası", res.message || "Hata oluştu");
				return;
			    }
				// TOKEN SAKLA
                try {
                await AsyncStorage.setItem("accessToken", res.data.access_token);
                console.log("Token başarıyla saklandı");
			
                } catch (err) {
                console.error("Token kaydedilirken hata:", err);
                }


			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					const formErrors: Record<string, string> = {};
					err.inner.forEach((error) => {
						if (error.path) {
							formErrors[error.path] = error.message;
						}
					});
					setErrors(formErrors)
					
				}
			}
			
		} else {
			try {
				await registerSchema.validate(
					{ first_name: name, last_name: surname, email, password, password2: password, isCheck, secondCheck },
					{ abortEarly: false }
				);
					const res = await registerService({
                     first_name: name,
                     last_name: surname,
                     email,
                     password,
                     password2: password, // düzeltilecek
                     });

                  // 2. Başarısızsa mesaj göster
                      if (!res.success) {
                               Alert.alert("Kayıt Hatası", res.message || "Bilinmeyen hata");
                        return;
                       }

                   // 3. Başarılıysa login sekmesine geç
                     Alert.alert("Başarılı", "Kaydınız oluşturuldu. Lütfen giriş yapın.");
	 				setTab("login");
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					const formErrors: Record<string, string> = {};
					err.inner.forEach((error) => {
						if (error.path) {
							formErrors[error.path] = error.message;
						}
					});
					setErrors(formErrors);
				} 
			}
		
		}
	};

	return (
		<SafeAreaView className=" flex-1">
			<Wrapper
				{...(tab === "register"
					? {
							contentContainerStyle: WrapperStyle,
							keyboardShouldPersistTaps: "handled",
							horizontal: false,
						}
					: {
							style: WrapperStyle,
						})}
			>
				{/* ————— Modallar ————— */}
				<Modal visible={showContractModal} animationType="slide" transparent onRequestClose={() => setShowContractModal(false)}>
					<View className="flex-1 justify-center items-center">
						<View className="w-11/12 h-4/5 bg-white rounded-lg p-4">
							<View className="flex-row justify-between items-center mb-2">
								<Text className="text-lg font-bold">Üyelik Sözleşmesi</Text>
								<TouchableOpacity onPress={() => setShowContractModal(false)}>
									<Feather name="x" size={24} color="#000" />
								</TouchableOpacity>
							</View>
							<ScrollView>
								<Text className="text-sm">{MembershipAgreement}</Text>
							</ScrollView>
						</View>
					</View>
				</Modal>

				<Modal visible={showKVKKModal} animationType="slide" transparent onRequestClose={() => setShowKVKKModal(false)}>
					<View className="flex-1 mt-3 justify-center items-center">
						<View className="w-11/12 h-4/5 bg-white rounded-lg p-4">
							<View className="flex-row justify-between items-center mb-2">
								<Text className="text-lg font-bold">KVKK Aydınlatma Metni</Text>
								<TouchableOpacity onPress={() => setShowKVKKModal(false)}>
									<Feather name="x" size={24} color="#000" />
								</TouchableOpacity>
							</View>
							<ScrollView>
								<Text className="text-sm">{kvkkAydinlatmaMetni}</Text>
							</ScrollView>
						</View>
					</View>
				</Modal>
				{/* ————— Modallar Son ————— */}

				<View className=" mt-5 ">
					<Image className="w-28 h-20" source={require("../../assets/ojs-1.png")} resizeMode="contain" />
				</View>
				<Text className="text-3xl font-bold ">{tab === "login" ? "Giriş Yap" : "Üye Ol"}</Text>

				<View className="mt-10 flex-row w-[355px] mb-8 gap-4  ">
					<TouchableOpacity
						className={`flex-1 py-3  items-center justify-center  border border-gray-300 rounded-t-md  ${
							tab === "login" ? "bg-inherit" : "bg-inputgray "
						}`}
						onPress={() => setTab("login")}
					>
						<Text className={tab === "login" ? "font-bold text-logintext " : "text-black "}>Giriş Yap</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className={`flex-1 py-3 items-center justify-center border border-gray-300 rounded-t-md  ${
							tab === "register" ? "bg-inherit" : "bg-inputgray"
						}`}
						onPress={() => setTab("register")}
					>
						<Text className={tab === "register" ? "font-bold text-logintext" : "text-black "}>Üye Ol</Text>
					</TouchableOpacity>
				</View>

				<View>
					{tab === "login" ? (
						<>
							<LoginForm label="*E-Posta" value={email} onChangeText={handleEmailChange} 
							error={errors.username || errors.email} />
							
							<LoginForm label="*Şifre" value={password} onChangeText={handlePasswordChange}
							error={errors.password} />
							
						</>
					) : (
						<>
						
							<RegisterForm label="Ad" value={name} onChangeText={handleNameChange}
							error={errors.first_name} />
							<RegisterForm label="Soyad" value={surname} onChangeText={handleSurnameChange}/> 
							<LoginForm label="*E-Posta" value={email} onChangeText={handleEmailChange}
							error={errors.email || errors.email} />
							<LoginForm label="*Şifre" value={password} onChangeText={handlePasswordChange}
							error={errors.password} />
						</>
					)}
				</View>

				<View className="w-[324px] h-[20px] relative  ">
					{tab === "login" && (
						<TouchableOpacity className="absolute right-0 bottom-2 -translate-y-1/2">
							<Text className="text-sm underline">Şifremi unuttum?</Text>
						</TouchableOpacity>
					)}
				</View>

				<TouchableOpacity
					onPress={handleSubmit}
					disabled={tab === "register" && !secondCheck}
					className={`rounded-md mx-9 justify-center items-center  w-[324px] h-[55px] bg-black 
                     ${tab === "register" && !secondCheck ? "bg-gray-300" : "bg-black"}`}
				>
					{/*  dinamik yaparak checklenip checklenmeme durumuna göre renk değişimi olur */}

					<Text className=" text-2xl semibold text-white text-center ">{tab === "login" ? "GİRİŞ YAP" : "ÜYE OL"}</Text>
				</TouchableOpacity>

				{tab === "register" && (
					<>
						<View className="w-[320px] mx-auto self-center flex-row items-start mt-4 ">
							<TouchableOpacity onPress={() => setIsCheck(!isCheck)}>
								<Feather name={isCheck ? "check-square" : "square"} size={20} color={isCheck ? "#2126AB" : "#2126AB"} />
							</TouchableOpacity>
							<Text className="ml-2 flex-1 text-xs leading-[20px] text-ticaritext">
								Kampanyalardan haberdar olmak için <Text className="underline font-bold text-black ">Ticari Elektronik İleti Onayı </Text> metnini
								okudum, onaylıyorum. Tarafınızdan gönderilecek ticari elektronik iletileri almak istiyorum.{" "}
							</Text>
						</View>

						<View className="w-[320px] mx-auto self-center flex-row items-start mt-4 ">
							<TouchableOpacity onPress={() => setSecondCheck(!secondCheck)}>
								<Feather name={secondCheck ? "check-square" : "square"} size={20} color={isCheck ? "#2126AB" : "#2126AB"} />
							</TouchableOpacity>

							<Text className="ml-2 flex-1 leading-[20px] text-xs text-ticaritext">
								<Text onPress={() => setShowContractModal(true)} className=" underline font-bold text-black">
									Üyelik sözleşmesini
								</Text>{" "}
								<Text className="text-ticaritext">ve</Text>{" "}
								<Text onPress={() => setShowKVKKModal(true)} className="underline font-bold text-black">
									KVKK Aydınlatma Metni{" "}
								</Text>
								<Text className="text-ticaritext">okudum, kabul ediyorum</Text>
							</Text>
						</View>

						<View className="w-full px-9">
							<Text className="mt-8 ml-3 leading-[20px] text-xs text-black">
								Zaten hesabınız var mı?{" "}
								<Text onPress={() => setTab("login")} className="text-logintext">
									Giriş Yap
								</Text>
							</Text>
						</View>
					</>
				)}
			</Wrapper>
		</SafeAreaView>
	);
};


export default LoginRegister;
