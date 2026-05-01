"use server"
import { cookies } from "next/headers";
import { UserInfo } from "../types/auth";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export const UpdateUser = async (UserPayload: Partial<UserInfo>, user_id: number) => {
  try {
    const cookiesList = await cookies();
    const sessionToken = cookiesList.get("session_token")?.value;


    if (!sessionToken) {
      return { status: "fail", message: "No session token found" };
    }

    const res = await fetch(`${API_BASE_URL}/update-profile/${user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ ...UserPayload }),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      return {
        status: "fail",
        message: data.message || "Failed to update user information",
      };
    }

    return {
      status: "success",
      user: data.user_info,
    };
  } catch (error) {
    console.error("Update User API Error:", error);
    return {
      status: "fail",
      message: "An error occurred while updating user information",
    };
  }
}

export async function changePassword(currentPassword: string, newPassword: string, user_id: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return { status: 'fail', message: 'No session token found' };
    }

    const res = await fetch(`${API_BASE_URL}/change-password/${user_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ old_password: currentPassword, new_password: newPassword }),
    });

    const data = await res.json();

    if (!res.ok || data.status !== 'success') {
      return {
        status: 'fail',
        message: data.message || 'Failed to change password',
      };
    }

    return {
      status: 'success',
      message: 'Password changed successfully',
    };
  } catch (error) {
    console.error('Change Password API Error:', error);
    return {
      status: 'fail',
      message: 'An error occurred while changing password',
    };
  }
}


export async function uploadProfileImageAction(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return { status: "fail", message: "Please log in to upload an image" };
    }

    // Pass the FormData directly to the external API
    const res = await fetch(`${API_BASE_URL}/user/upload-image`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        status: "fail",
        message: data.message || "Upload failed from external API"
      };
    }

    return { status: "success", data };
  } catch (error) {
    console.error("Server Action Error:", error);
    return { status: "fail", message: "Network error occurred on server" };
  }
}

export async function fetchUserProfile(userId: string | number) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    return { status: "fail", message: "No session token found" };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/get-profile/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: 'no-store' // Ensure we always get fresh data
    });

    if (!res.ok) {
      return { status: "fail", message: `API Error: ${res.statusText}` };
    }

    const data = await res.json();
    return { status: "success", user: data.user_info };

  } catch (error) {
    console.error("Get User Profile API Error:", error);
    return { status: "fail", message: "An error occurred while fetching user profile" };
  }
}