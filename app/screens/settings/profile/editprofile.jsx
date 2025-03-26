import React, { useState, useEffect } from "react";
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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SERVER_URL } from "../../../../utils/config.js";

const avatarSize = 80;
const bannerHeight = 120;

export default function EditProfile() {
  
  // We'll store the user's credentials behind the scenes
  const [localEmail, setLocalEmail] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  
  // Current profile data
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [name, setName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [pronouns, setPronouns] = useState("he/him");
  const [favourites, setFavourites] = useState([]); // optional
  
  // States for the "hover" effect on banner/avatar
  const [bannerHover, setBannerHover] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  
  const router = useRouter();
  // 1. On mount, load user from AsyncStorage and fetch their profile from the server
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("userProfile");
        if (!stored) {
          Alert.alert("Error", "No user found. Please log in first.");
          router.push("/");
          return;
        }
        const localUser = JSON.parse(stored);
        setLocalEmail(localUser.email || "");
        setLocalPassword(localUser.password || "");

        // Fetch the latest profile data from the server
        const response = await fetch(
          `${SERVER_URL}/profile?email=${localUser.email}`
        );
        if (!response.ok) {
          throw new Error("Failed to load profile from server");
        }
        const serverData = await response.json();
        if (!serverData.hasProfile) {
          Alert.alert("No Profile Found", "Please create a profile first.");
          router.push("/screens/settings/profile/createprofile");
          return;
        }
        // Fill the state with current profile data
        setAvatarUrl(serverData.avatarUrl || "");
        setBannerUrl(serverData.coverUrl || "");
        setName(serverData.name || "");
        setAboutMe(serverData.bio || "");
        setPronouns(serverData.pronouns || "he/him");
        setFavourites(serverData.favourites || []);
      } catch (error) {
        Alert.alert("Error", error.message);
        console.error("Error loading profile:", error);
      }
    })();
  }, []);

  // 2. Pick a new Banner
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

  // 3. Pick a new Avatar
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
    if (!result.cancelled) {
      setAvatarUrl(result.uri);
    }
  };

  // 4. Save (Update) Profile
  const handleSaveProfile = async () => {
    try {
      if (!localEmail || !localPassword) {
        Alert.alert("Error", "No stored credentials found.");
        return;
      }
      const body = {
        email: localEmail,
        password: localPassword,
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
        throw new Error(data.error || "Failed to update profile");
      }

      // Update local userProfile
      const updatedProfile = {
        email: localEmail,
        password: localPassword,
        hasProfile: true,
        name,
        pronouns,
        bio: aboutMe,
        coverUrl: bannerUrl,
        avatarUrl,
        favourites,
      };
      await AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));

      Alert.alert("Success", "Profile updated successfully!");
      router.back(); // or router.push("/screens/settings/profile")
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // 5. Delete Account
  const handleDeleteAccount = async () => {
    try {
      if (!localEmail) {
        Alert.alert("Error", "No email found, cannot delete account.");
        return;
      }
      const response = await fetch(`${SERVER_URL}/deleteAccount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: localEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account");
      }
      // Clear local
      await AsyncStorage.removeItem("userProfile");
      Alert.alert("Account Deleted", "Your account has been deleted.");
      router.push("/");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // 6. Logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userProfile");
      router.push("/");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Edit Your Profile</Text>

      <Text style={styles.sectionHeader}>Avatar & Banner</Text>

      {/* Banner Pressable */}
      <Pressable
        style={styles.bannerContainer}
        onPress={handleSelectBanner}
        onPressIn={() => setBannerHover(true)}
        onPressOut={() => setBannerHover(false)}
      >
        <ImageBackground
          source={{ uri: bannerUrl }}
          style={styles.bannerImage}
          resizeMode="cover"
        >
          {bannerHover && (
            <View style={styles.overlay}>
              <MaterialIcons name="camera-alt" size={24} color="#fff" />
            </View>
          )}
        </ImageBackground>
      </Pressable>

      {/* Avatar overlapping banner */}
      <View style={styles.avatarAbsolute}>
        <Pressable
          style={styles.avatarPressable}
          onPress={handleSelectAvatar}
          onPressIn={() => setAvatarHover(true)}
          onPressOut={() => setAvatarHover(false)}
        >
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          {avatarHover && (
            <View style={[styles.overlay, styles.avatarOverlay]}>
              <MaterialIcons name="camera-alt" size={24} color="#fff" />
            </View>
          )}
        </Pressable>
      </View>

      <Text style={styles.sectionHeader}>Public Information</Text>
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
        <Text style={styles.label}>About Me</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tell us about yourself..."
          value={aboutMe}
          onChangeText={setAboutMe}
          multiline
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

      {/* Save Changes */}
      <Pressable style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </Pressable>

      {/* Delete Account */}
      <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </Pressable>

      {/* Change Password */}
      <Pressable
        style={styles.editButton}
        onPress={() => router.push("/screens/settings/profile/changepassword")}
      >
        <Text style={styles.editButtonText}>Change Password</Text>
      </Pressable>

      {/* Logout */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    marginTop: 20,
  },

  // Banner
  bannerContainer: {
    width: "100%",
    height: bannerHeight,
    marginBottom: 20,
  },
  bannerImage: {
    flex: 1,
    backgroundColor: "#ccc",
  },

  // Overlays
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarOverlay: {
    borderRadius: avatarSize / 2,
  },

  // Avatar Over Banner
  avatarAbsolute: {
    position: "absolute",
    top: bannerHeight - avatarSize / 2,
    left: 16,
  },
  avatarPressable: {
    width: avatarSize,
    height: avatarSize,
  },
  avatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },

  // Fields
  fieldContainer: { marginBottom: 10 },
  label: { fontSize: 14, color: "#555", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  picker: { height: 40, width: "100%" },

  // Buttons
  saveButton: {
    backgroundColor: "black",
    padding: 14,
    borderRadius: 8,
    marginVertical: 20,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  deleteButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  editButtonText: { color: "#fff", fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#555",
    padding: 12,
    borderRadius: 8,
    marginBottom: 30,
  },
  logoutText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});