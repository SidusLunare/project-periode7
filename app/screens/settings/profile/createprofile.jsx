import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const SERVER_URL = "http://192.168.1.92:3000";
const avatarSize = 80;
const bannerHeight = 120;

export default function CreateProfile() {
  const router = useRouter();

  // Basic credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Avatar & Banner
  const [avatarUrl, setAvatarUrl] = useState("https://via.placeholder.com/100");
  const [bannerUrl, setBannerUrl] = useState("https://via.placeholder.com/1000x300/000/fff?text=Banner");

  // Public fields
  const [name, setName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [pronouns, setPronouns] = useState("he/him");

  // Example favorites array
  const [favourites, setFavourites] = useState([]);

  // Pick Banner
  const handleSelectBanner = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "We need permission to select images.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.cancelled) {
      setBannerUrl(result.uri);
    }
  };

  // Pick Avatar
  const handleSelectAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "We need permission to select images.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setAvatarUrl(result.uri);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    try {
      if (!email) {
        Alert.alert("Error", "No email provided, cannot delete account.");
        return;
      }
      const response = await fetch(`${SERVER_URL}/deleteAccount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account");
      }
      await AsyncStorage.removeItem("userProfile");
      Alert.alert("Account Deleted", "Your account has been deleted.");
      router.push("/");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Save Profile
  const handleSaveProfile = async () => {
    try {
      const body = {
        email,
        password,
        name,
        pronouns,
        bio: aboutMe,
        coverUrl: bannerUrl,
        avatarUrl,
        favourites,
      };
      const response = await fetch(`${SERVER_URL}/createProfile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create/update profile");
      }

      // Store locally with hasProfile = true
      const userProfile = {
        email,
        password,
        hasProfile: true,
        name,
        pronouns,
        bio: aboutMe,
        coverUrl: bannerUrl,
        avatarUrl,
        favourites,
      };
      await AsyncStorage.setItem("userProfile", JSON.stringify(userProfile));

      Alert.alert("Success", "Profile saved successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Profile Settings</Text>

      {/* Credentials */}
      <Text style={styles.sectionHeader}>Credentials</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Avatar & Banner */}
      <Text style={styles.sectionHeader}>Avatar & Banner</Text>
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={{ uri: bannerUrl }}
          style={styles.bannerImage}
          resizeMode="cover"
        >
          <Pressable style={styles.bannerEditIcon} onPress={handleSelectBanner}>
            <Text style={styles.editIconText}>🖉</Text>
          </Pressable>
        </ImageBackground>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <Pressable style={styles.avatarEditIcon} onPress={handleSelectAvatar}>
            <Text style={styles.editIconText}>🖉</Text>
          </Pressable>
        </View>
      </View>

      {/* Public Info */}
      <Text style={styles.sectionHeader}>Public information</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>About me</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={aboutMe}
          onChangeText={setAboutMe}
          multiline
          placeholder="Tell us about yourself..."
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Pronouns</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={pronouns}
            onValueChange={(itemValue) => setPronouns(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="He/Him" value="he/him" />
            <Picker.Item label="She/Her" value="she/her" />
            <Picker.Item label="They/Them" value="they/them" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>

      {/* Favourites (optional) */}

      {/* Delete Account */}
      <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </Pressable>

      {/* Save Changes */}
      <Pressable style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save changes</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  sectionHeader: { fontSize: 16, fontWeight: "bold", marginVertical: 10, marginTop: 20 },
  fieldContainer: { marginBottom: 10 },
  label: { fontSize: 14, color: "#555", marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 8, fontSize: 14, backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 80, textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 6,
    overflow: "hidden", backgroundColor: "#f9f9f9",
  },
  picker: { height: 40, width: "100%" },
  bannerContainer: { position: "relative", marginBottom: 20 },
  bannerImage: {
    width: "100%", height: 120, backgroundColor: "#ccc",
    justifyContent: "flex-end",
  },
  bannerEditIcon: {
    position: "absolute", right: 10, bottom: 10,
    backgroundColor: "#000000aa", borderRadius: 4, padding: 4,
  },
  editIconText: { color: "#fff", fontSize: 14 },
  avatarContainer: {
    position: "absolute", bottom: -40, left: 16,
    flexDirection: "row", alignItems: "center",
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 3, borderColor: "#fff",
  },
  avatarEditIcon: {
    marginLeft: -24, marginTop: -20,
    backgroundColor: "#000000aa", borderRadius: 16, padding: 4,
  },
  deleteButton: {
    backgroundColor: "#ff4444", padding: 12,
    borderRadius: 8, marginVertical: 20,
  },
  deleteButtonText: {
    color: "#fff", textAlign: "center", fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "black", padding: 14,
    borderRadius: 8, marginBottom: 30,
  },
  saveButtonText: {
    color: "#fff", textAlign: "center", fontWeight: "bold",
  },
});
