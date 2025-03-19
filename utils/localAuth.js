// utils/localAuth.js
import AsyncStorage from "@react-native-async-storage/async-storage";

// If you're on Android emulator, use 10.0.2.2 instead of localhost
// If you're on a real device, use your computer's LAN IP (like 192.168.x.x)
const SERVER_URL = "http://10.250.187.36:3000";

export async function registerUser(email, password) {
  // 1. Always store locally so user can be offline
  const newUser = { email, password };
  await AsyncStorage.setItem("userProfile", JSON.stringify(newUser));

  // 2. Attempt to sync with server
  try {
    const response = await fetch(`${SERVER_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Server registration failed");
    }
    // If server returns ok, we are synced
    return { message: "Registered locally + server synced" };
  } catch (error) {
    // If offline or server error, we still have local data
    return { message: "Registered locally (server sync failed)", error };
  }
}

export async function loginUser(email, password) {
  // 1. Try server login first
  try {
    const response = await fetch(`${SERVER_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      // If server login is good, store/refresh local credentials
      const user = { email, password };
      await AsyncStorage.setItem("userProfile", JSON.stringify(user));
      return { message: "Logged in via server + updated local" };
    } else {
      const data = await response.json();
      throw new Error(data.error || "Server login failed");
    }
  } catch (serverError) {
    // 2. If server unreachable or error, check local storage
    const storedProfile = await AsyncStorage.getItem("userProfile");
    if (!storedProfile) {
      throw new Error("No local user found. Please register first.");
    }
    const localUser = JSON.parse(storedProfile);
    if (localUser.email === email && localUser.password === password) {
      return { message: "Logged in offline (server not available)" };
    } else {
      throw new Error("Invalid offline credentials + server login failed");
    }
  }
}
