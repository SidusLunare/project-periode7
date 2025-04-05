import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  ImageBackground,
  Alert,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SERVER_URL } from "../../../../utils/config.js";

// Set bannerHeight and use it for avatarSize as well
const bannerHeight = 120;
const avatarSize = bannerHeight; // Avatar will be as big as the banner's height

export default function CreateProfile() {
  const router = useRouter();

  // Hidden credentials
  const [localEmail, setLocalEmail] = useState("");
  const [localPassword, setLocalPassword] = useState("");

  // Banner & Avatar URLs
  const [avatarUrl, setAvatarUrl] = useState("https://via.placeholder.com/100");
  const [bannerUrl, setBannerUrl] = useState(
    "https://via.placeholder.com/1000x300/000/fff?text=Banner"
  );

  // Public info
  const [name, setName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [favourites, setFavourites] = useState([]);

  // Load credentials from AsyncStorage on mount
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
      } catch (error) {
        console.error("Error loading user from AsyncStorage:", error);
      }
    })();
  }, []);

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
      console.log("successfully set avatar");
      console.log(result.assets[0].uri);
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
      console.log("successfully set avatar");
      console.log(result.assets[0].uri);
    }
  };

  // Save Profile (hidden credentials are passed along)
  const handleSaveProfile = async () => {
    try {
      if (!localEmail || !localPassword) {
        Alert.alert(
          "Error",
          "No stored credentials found. Please log in first."
        );
        return;
      }
      const body = {
        email: localEmail,
        password: localPassword,
        // Public info (if needed, uncomment below)
        // name,
        // pronouns,
        // bio: aboutMe,
        coverUrl: bannerUrl,
        avatarUrl,
        // favourites,
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

      const userProfile = {
        email: localEmail,
        password: localPassword,
        hasProfile: true,
        // name,
        // pronouns,
        // bio: aboutMe,
        coverUrl: bannerUrl,
        avatarUrl,
        // favourites,
      };
      await AsyncStorage.setItem("userProfile", JSON.stringify(userProfile));

      Alert.alert("Success", "Profile saved successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <>
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialIcons
                style={styles.headerIcon}
                name="person"
                size={32}
                color="#000"
        />
        <Text style={styles.header}>Create Your Profile</Text>
      </View>

      <Text style={styles.sectionHeader}>Avatar & Banner</Text>

      {/* Banner Container with full left-side border radius */}
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={{ uri: bannerUrl }}
          style={[styles.bannerImage, { backgroundColor: "#fff" }]}
          resizeMode="cover"
        >
          <Pressable
            style={styles.bannerPressable}
            onPress={handleSelectBanner}
          >
            <View style={styles.bannerOverlay}>
              <MaterialIcons
                style={styles.bannerOverlayIcon}
                name="camera-alt"
                size={24}
                color="#fff"
              />
            </View>
          </Pressable>
        </ImageBackground>

        {/* Avatar positioned inside banner on the left */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatarUrl }}
            style={[styles.avatar, { backgroundColor: "#fff" }]}
          />
          <Pressable
            style={styles.avatarPressable}
            onPress={handleSelectAvatar}
          >
            <View style={styles.avatarOverlay}>
              <MaterialIcons
                style={styles.avatarOverlayIcon}
                name="camera-alt"
                size={24}
                color="#fff"
              />
            </View>
          </Pressable>
        </View>
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
          <RNPickerSelect
          onValueChange={(value) => setPronouns(value)}
          value={pronouns}
          placeholder={{ label: "Select your pronouns...", value: null }}
          items={[
            { label: "He/Him", value: "he/him" },
            { label: "She/Her", value: "she/her" },
            { label: "They/Them", value: "they/them" },
            { label: "Other", value: "other" },
          ]}
        />
        </View>
      </View>

    </ScrollView>
      <View style={styles.saveButtonContainer}>
        <Pressable style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </Pressable> 
      </View>
    </>
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
    display: "flex",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
    gap: "5"
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
  },
  headerIcon: {
    height: "32",
    width: "32"
  },
  sectionHeader: {
    fontSize: 24,
    letterSpacing: 0,
    fontStyle: "italic",
    fontFamily: "Inter-Light",
    color: "#000",
    textAlign: "left",
    width: 178,
    height: 30
  },
  fieldContainer: { marginBottom: 10, marginLeft: 16, marginTop: 16, },
  label: {
    fontSize: 18,
    letterSpacing: 0,
    fontStyle: "italic",
    fontWeight: "200",
    fontFamily: "Inter-ExtraLight",
    color: "#000",
    textAlign: "left"
  },
  input: {
    shadowColor: "rgba(66, 66, 66, 0.6)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 16.8,
    elevation: 16.8,
    shadowOpacity: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
    height: 50,
    paddingLeft: "16",
    textAlignVertical: "center"
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  pickerContainer: {
    shadowColor: "rgba(66, 66, 66, 0.6))",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 16.8,
    elevation: 16.8,
    shadowOpacity: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    flex: 1,
    width: "50%",
    height: 50
  },
  /* Banner Container */
  bannerContainer: {
    position: "relative",
    marginBottom: 40,
    // Round the left side fully:
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerOverlayIcon: {
    padding: 10,
    marginLeft: 117,
    borderRadius: 100,
    backgroundColor: "#000000aa",
  },
  /* Avatar - now inside the banner, on the left side */
  avatarContainer: {
    position: "absolute",
    left: 0,
    top: 0,
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarOverlayIcon: {
    padding: 8,
    borderRadius: bannerHeight / 2,
    backgroundColor: "#000000aa",
  },
  /* Save Button */
  saveButtonContainer: {
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    position: "absolute",
    bottom: 32
  },
  saveButton: {
    shadowColor: "rgba(66, 66, 66, 0.6)",
    shadowOffset: {
    width: 0,
    height: 0
    },
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
    width: "100%"
  },
});