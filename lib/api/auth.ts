
"use server"
import { cookies } from "next/headers";
import { UserInfo } from "../types/auth";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse =
  | { status: "success"; user: UserInfo }
  | { status: "fail"; message: string };

export async function loginUser(
  payload: LoginPayload
): Promise<LoginResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || data.status !== 'success') {
      return {
        status: "fail",
        message: data.message || "Login failed",
      };
    }

    //Cookies logic 
    const expiresAt = new Date(data.security.expires_in * 1000);
    (await cookies()).set('session_token', data.security.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    });

    return {
      status: "success",
      user: data.user_info
    };

  }
  catch (error) {
    return {
      status: "fail",
      message: "An error occurred during login.",
    };
  }
}

export async function registerUser(payload: any) {
  const res = await fetch(`${API_BASE_URL}/create_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || data.status !== 'success') {
    return {
      status: "fail",
      message: data.message || "Registration failed",
    };
  }

  return { status: "success", user: data.user_info };
}

export async function logoutAction() {
  (await cookies()).delete('session_token');
}

export async function checkAuthSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token');

  if (!token) {
    return false;
  }

  return true;
}

