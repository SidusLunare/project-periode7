import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_URL = "http://192.168.0.125:3000"; // or your machine's IP if using a device

// Register a user: store minimal info locally + try server
export async function registerUser(email, password) {
  const userProfile = { email, password };
  // Save locally for offline
  await AsyncStorage.setItem("userProfile", JSON.stringify(userProfile));

  // Attempt server sync
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
    return { message: "Registered locally + server synced" };
  } catch (error) {
    return { message: "Registered locally (server sync failed)", error };
  }
}

// Login a user: try server first, fallback to local if offline
export async function loginUser(email, password) {
  // 1. Try server
  try {
    const response = await fetch(`${SERVER_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      // If server login success, store/refresh local
      const userProfile = { email, password };
      await AsyncStorage.setItem("userProfile", JSON.stringify(userProfile));
      return { message: "Logged in via server + updated local" };
    } else {
      const data = await response.json();
      throw new Error(data.error || "Server login failed");
    }
  } catch (error) {
    console.warn("Server login failed, checking local offline data...");

    // 2. Offline fallback
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

// Optional: logout function
export async function logoutUser() {
  await AsyncStorage.removeItem("userProfile");
}
