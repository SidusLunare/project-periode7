import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URL } from "../../../../utils/config.js";


export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNew, setRepeatNew] = useState("");
  
  const router = useRouter();
  const handleChangePassword = async () => {
    if (!oldPassword.trim() || !newPassword.trim() || !repeatNew.trim()) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    if (newPassword !== repeatNew) {
      Alert.alert("Error", "New passwords don't match!");
      return;
    }

    try {
      // 1. Load local user to get email
      const stored = await AsyncStorage.getItem("userProfile");
      if (!stored) {
        Alert.alert("Error", "No user found. Please log in first.");
        return;
      }
      const localUser = JSON.parse(stored);

      // 2. POST to server
      const body = {
        email: localUser.email,
        oldPassword,
        newPassword,
      };
      const response = await fetch(`${SERVER_URL}/changePassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      Alert.alert("Success", "Password changed successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <Text style={styles.subtitle}>Your new password must:</Text>
      <Text style={styles.subtitle}>• Be at least 8 characters long</Text>
      <Text style={styles.subtitle}>
        • Include uppercase, lowercase, numbers, symbols
      </Text>
      <Text style={styles.subtitle}>
        • Not be the same as your current password
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Old Password"
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Repeat New Password"
        value={repeatNew}
        onChangeText={setRepeatNew}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change password</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 14, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 8,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
