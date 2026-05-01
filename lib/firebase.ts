
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, set, push, serverTimestamp } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


// Check if we have a valid configuration
const isConfigValid = !!firebaseConfig.apiKey && !!firebaseConfig.databaseURL;

// Initialize Firebase
let app;
let db: any = null;

if (typeof window !== "undefined" && isConfigValid) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getDatabase(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

export { db, ref, onValue, set, push, serverTimestamp };



// Helper to listen to driver location
export const listenToDriverLocation = (tripId: string, callback: (location: { lat: number, lng: number, rotation: number }) => void) => {
  if (!db) {
    return () => {};
  }
  const locationRef = ref(db, `trips/${tripId}/driverLocation`);
  return onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback({
        lat: data.latitude,
        lng: data.longitude,
        rotation: data.rotation || 0
      });
    }
  });
};

// Helper to listen to trip status signals
export const listenToTripStatus = (tripId: string, callback: (status: string) => void) => {
  if (!db) {
    return () => {};
  }
  const statusRef = ref(db, `trips/${tripId}/status`);
  return onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
};

// Helper to listen to chat messages
export const listenToChat = (tripId: string, callback: (messages: any[]) => void) => {
  if (!db) {
    return () => {};
  }
  const chatRef = ref(db, `chats/trip_${tripId}/messages`);
  return onValue(chatRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const messages = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      callback(messages);
    }
  });
};

