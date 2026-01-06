import { API_BASE_URL, API_KEY } from "@env";

export const REGISTER_URL = `${API_BASE_URL}/auth/register`;
export const LOGIN_URL = `${API_BASE_URL}/auth/login`;



export type AuthResponse = {
  success: boolean;
  data?: any;
  message?: string;
};

export type RegisterProps = {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	password2: string;

};


const getErrorMessage = (json: any): string => {
	return json.detail
	 ? json.detail 
	 : json.reason 
	 ? Object.values(json.reason).flat().join("\n") 
	 : json.message || "Beklenmeyen hata oluştu.";

};

// LOGIN servisi
export const loginService = async (username: string, password: string): Promise<AuthResponse> => {
  
  const response = await fetch (LOGIN_URL, {
	method: "POST",
	headers: {
		"Content-Type": "application/json"},
	body: JSON.stringify({ username, password, api_key: API_KEY }),
  })

  const json = await response.json();
  console.log("loginService json:", json);

  if (!response.ok) {
	return {
	  success: false,
	  message: getErrorMessage(json),
	}; }
	return {
	  success: true,
	  data: json
	}

}
 // REGISTER servisi
 export const registerService = async ({first_name, last_name, email, password, password2}:RegisterProps): Promise <AuthResponse>  => {
  
	const res = await fetch( REGISTER_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ first_name, last_name, email, password, password2, api_key: API_KEY }),
	})

	const json = await res.json();

	if (!res.ok) {
		return {
			success: false,
			message: getErrorMessage(json),
		};
	}
	return {
		success: true,
		data: json,
	};	
 }