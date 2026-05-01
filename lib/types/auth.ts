export interface UserInfo {
  ID: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string[];
  phone_number: string;
  registered: string;
  address: string;
  profile_image: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  security: {
    token: string;
    email: string;
    expires_in: number;
  };
  user_info: UserInfo;
}