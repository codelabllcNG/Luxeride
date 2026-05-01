// types/contact.ts

export interface ContactPageData {
  hero: {
    title: string;
    description: string;
    background_image: string;
  };
  contact_section: {
    phone: {
      primary: string;
      alternative: string;
    };
    email: {
      primary: string;
      alternative: string;
    };
    hours: {
      time: string;
      days: string;
    };
    service_area: {
      address: string;
    };
  };
  "our service area section": Array<{
    heading: string;
    description: string;
    map: Array<{
      lat: string;
      long: string;
    }>;
  }>;
}
export interface ApiResponse {
  status: string;
  message: string;
  data: ContactPageData;
}
export interface ContactFormPayload {
  name: string;
  fullname: string;
  email: string;
  phone: string;
  subject: string;
  inquiry_type: string;
  message: string;
}

export interface ContactResponse {
  status: "success" | "fail";
  message: string;
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getContactPageData(): Promise<ContactPageData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/get-contactus-data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch contact data");
    }

    const json: ApiResponse = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching contact page data:", error);
    return null;
  }
}

export async function submitContactForm(formData: ContactFormPayload): Promise<ContactResponse> {
  if (!API_BASE_URL) {
    return { status: "fail", message: "Server configuration error" };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/submit-form`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok || data.status !== 'success') {
      return { 
        status: "fail", 
        message: data.message || "Failed to send message" 
      };
    }

    return { status: "success", message: "Message sent successfully" };

  } catch (error) {
    console.error("Contact Form Error:", error);
    return { status: "fail", message: "Network error. Please try again later." };
  }
}