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
import { useRouter, useFocusEffect } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SERVER_URL } from "../../../../utils/config.js";

const bannerHeight = 120;
const avatarSize = bannerHeight; // Avatar will be as big as the banner's height

export default function EditProfile() {
  const router = useRouter();

  // Hidden credentials
  const [localEmail, setLocalEmail] = useState("");
  const [localPassword, setLocalPassword] = useState("");

  // Profile data loaded from server (default values)
  const [avatarUrl, setAvatarUrl] = useState("https://via.placeholder.com/100");
  const [bannerUrl, setBannerUrl] = useState("https://via.placeholder.com/1000x300/000/fff?text=Banner");
  const [name, setName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [pronouns, setPronouns] = useState("he/him");
  const [favourites, setFavourites] = useState([]);

  // States for the "hover" effect on banner/avatar
  const [bannerHover, setBannerHover] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);

  // Load profile data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const loadProfile = async () => {
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
          const response = await fetch(`${SERVER_URL}/profile?email=${localUser.email}`);
          if (!response.ok) {
            throw new Error("Failed to load profile from server");
          }
          const serverData = await response.json();
          if (!serverData.hasProfile) {
            Alert.alert("No Profile Found", "Please create a profile first.");
            router.push("/screens/settings/profile/createprofile");
            return;
          }
          // Set default values for editing
          setAvatarUrl(serverData.avatarUrl || "https://via.placeholder.com/100");
          setBannerUrl(serverData.coverUrl || "https://via.placeholder.com/1000x300/000/fff?text=Banner");
          setName(serverData.name || "");
          setAboutMe(serverData.bio || "");
          setPronouns(serverData.pronouns || "he/him");
          setFavourites(serverData.favourites || []);
        } catch (error) {
          Alert.alert("Error", error.message);
          console.error("Error loading profile:", error);
        }
      };
      loadProfile();
    }, [])
  );

  // Pick Banner Image
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
    if (!result.canceled) {
      setBannerUrl(result.assets[0].uri);
    }
  };

  // Pick Avatar Image
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
      setAvatarUrl(result.assets[0].uri);
    }
  };

  // Save Profile
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
      // Update local userProfile with new values
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
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Delete Account
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
      await AsyncStorage.removeItem("userProfile");
      Alert.alert("Account Deleted", "Your account has been deleted.");
      router.push("/");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Logout
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
      <View style={styles.headerContainer}>
        <MaterialIcons style={styles.headerIcon} name="person" size={32} color="#000" />
        
        <Text style={styles.header}>Edit Profile</Text>
      </View>

      <Text style={styles.sectionHeader}>Avatar & Banner</Text>

      {/* Banner Container with full left-side border radius */}
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={{ uri: bannerUrl }}
          style={[styles.bannerImage, { backgroundColor: "#fff" }]}
          resizeMode="cover"
        >
          <Pressable style={styles.bannerPressable} onPress={handleSelectBanner}>
            <View style={styles.bannerOverlay}>
              <MaterialIcons name="camera-alt" size={24} color="#fff" style={styles.bannerOverlayIcon} />
            </View>
          </Pressable>

          {/* Avatar positioned inside banner on the left */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: avatarUrl }}
              style={[styles.avatar, { backgroundColor: "#fff" }]}
              resizeMode="cover"
            />
            <Pressable style={styles.avatarPressable} onPress={handleSelectAvatar}>
              <View style={styles.avatarOverlay}>
                <MaterialIcons name="camera-alt" size={24} color="#fff" style={styles.avatarOverlayIcon} />
              </View>
            </Pressable>
          </View>
        </ImageBackground>
      </View>

      {/* Public Information Section */}
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

      <View style={styles.buttonContainer}>
        <Pressable style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </Pressable>
        <View style={styles.smallButtonContainer}>
          <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </Pressable>
          <Pressable style={styles.editButton} onPress={() => router.push("/screens/settings/profile/changepassword")}>
            <Text style={styles.editButtonText}>Change Password</Text>
          </Pressable>
        </View>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 5,
  },
  headerIcon: {
    width: 32,
    height: 32,
  },
  header: { fontSize: 22, fontWeight: "bold" },
  sectionHeader: {
    fontSize: 24,
    fontStyle: "italic",
    fontFamily: "Inter-Light",
    color: "#000",
    textAlign: "left",
    width: 178,
    height: 30,
    marginVertical: 10,
  },
  fieldContainer: {
    marginBottom: 10,
    marginLeft: 16,
    marginTop: 16,
  },
  label: {
    fontSize: 18,
    fontStyle: "italic",
    fontWeight: "200",
    fontFamily: "Inter-ExtraLight",
    color: "#000",
    textAlign: "left",
  },
  input: {
    shadowColor: "rgba(66,66,66,0.6)",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16.8,
    elevation: 16.8,
    shadowOpacity: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
    height: 50,
    paddingLeft: 16,
    textAlignVertical: "center",
  },
  textArea: {
    height: "auto",
    textAlignVertical: "top",
  },
  pickerContainer: {
    shadowColor: "rgba(66,66,66,0.6)",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16.8,
    elevation: 16.8,
    shadowOpacity: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    flex: 1,
    width: "50%",
    height: 50,
  },
  /* Banner Container */
  bannerContainer: {
    position: "relative",
    marginBottom: 40,
    // Full border radius on left side:
    borderTopLeftRadius: bannerHeight / 2,
    borderBottomLeftRadius: bannerHeight / 2,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: bannerHeight,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#dddddd",
  },
  bannerPressable: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerOverlay: {
    padding: 10,
    borderTopLeftRadius: bannerHeight / 2,
    borderBottomLeftRadius: bannerHeight / 2,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerOverlayIcon: {
    padding: 10,
    marginLeft: 117,
    borderRadius: 100,
    backgroundColor: "#000000aa",
  },
  /* Avatar inside Banner */
  avatarContainer: {
    position: "absolute",
    left: -2.4,
    top: -2,
    width: bannerHeight, // Same as banner height
    height: bannerHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: bannerHeight, // fill the container
    height: bannerHeight,
    borderRadius: bannerHeight / 2,
    borderWidth: 2,
    borderColor: "#dddddd",
  },
  avatarPressable: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarOverlay: {
    padding: 8,
    borderRadius: bannerHeight / 2,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarOverlayIcon: {
    padding: 8,
    borderRadius: bannerHeight / 2,
    backgroundColor: "#000000aa",
  },
  /* Save Button Container */
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 64,
    marginBottom: 64,
    gap: 16,
  },
  saveButton: {
    shadowColor: "rgba(66,66,66,0.6)",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16.8,
    elevation: 16.8,
    shadowOpacity: 1,
    borderRadius: 10,
    backgroundColor: "#000",
    flex: 1,
    width: "85%",
    height: 50,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    textAlignVertical: "center",
    height: "100%",
    width: "100%",
  },
  smallButtonContainer: {
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: "85%",
    gap: 8,
    height: 50,
  },
  deleteButton: {
    backgroundColor: "#EF0111",
    shadowColor: "rgba(66,66,66,0.6)",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16.8,
    elevation: 16.8,
    shadowOpacity: 1,
    borderRadius: 10,
    flex: 1,
    width: "85%",
    height: 50,
  },
  deleteButtonText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
    textAlignVertical: "center",
    height: "100%",
    width: "100%",
  },
  editButton: {
    backgroundColor: "rgb(49, 52, 255)",
    shadowColor: "rgba(66,66,66,0.6)",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16.8,
    elevation: 16.8,
    shadowOpacity: 1,
    borderRadius: 10,
    flex: 1,
    width: "85%",
    height: 50,
  },
  editButtonText: {
    color: "rgb(255, 255, 255)",
    textAlign: "center",
    fontWeight: "bold",
    textAlignVertical: "center",
    height: "100%",
    width: "100%",
  },
  logoutButton: {
    backgroundColor: "rgb(0, 0, 0)",
    shadowColor: "rgba(66,66,66,0.6)",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16.8,
    elevation: 16.8,
    shadowOpacity: 1,
    borderRadius: 10,
    flex: 1,
    width: "85%",
    height: 50,
  },
  logoutText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    textAlignVertical: "center",
    height: "100%",
    width: "100%",
  },
});
