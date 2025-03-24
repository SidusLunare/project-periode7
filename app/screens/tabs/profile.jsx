import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URL } from "../../../utils/config.js";


export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  
  // Example fields from server or local data
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [favourites, setFavourites] = useState([]);
  
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        // Load user credentials from AsyncStorage
        const stored = await AsyncStorage.getItem("userProfile");
        if (!stored) {
          setHasProfile(false);
          setIsLoading(false);
          return;
        }
        const localUser = JSON.parse(stored);

        // Optionally fetch from server, or just use local data
        // For demonstration, we'll fetch from server
        const response = await fetch(
          `${SERVER_URL}/profile?email=${localUser.email}`
        );
        if (!response.ok) {
          setHasProfile(false);
          setIsLoading(false);
          return;
        }
        const serverData = await response.json();
        if (!serverData.hasProfile) {
          setHasProfile(false);
        } else {
          setHasProfile(true);
          setEmail(serverData.email);
          setUserName(serverData.name || "");
          setPronouns(serverData.pronouns || "");
          setBio(serverData.bio || "");
          setCoverUrl(serverData.coverUrl || "");
          setAvatarUrl(serverData.avatarUrl || "");
          setFavourites(serverData.favourites || []);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // 1. Handle Logout
  const handleLogout = async () => {
    try {
      // Remove local user data
      await AsyncStorage.removeItem("userProfile");
      // Navigate to home or login
      router.push("/");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  if (!hasProfile) {
    return (
      <View style={styles.noProfileContainer}>
        <Text style={styles.noProfileText}>No profile found!</Text>
        <Pressable
          style={styles.createProfileButton}
          onPress={() => router.push("/screens/settings/profile/createprofile")}
        >
          <Text style={styles.createProfileText}>Create Profile</Text>
        </Pressable>
      </View>
    );
  }

  // 2. If user DOES have a profile -> show the advanced layout
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <ImageBackground
        source={coverUrl ? { uri: coverUrl } : null}
        style={styles.coverImage}
        resizeMode="cover"
      />
      <View style={styles.profileContainer}>
        <View style={styles.avatarWrapper}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]} />
          )}
        </View>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.pronouns}>{pronouns}</Text>
        <Text style={styles.bio}>{bio}</Text>

        {/* Example favorites */}
        {favourites.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>My favourites</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.favouritesRow}
            >
              {favourites.map((favUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: favUrl }}
                  style={styles.favImage}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* Edit / Change Password Buttons (Optional) */}
        <Pressable
          style={styles.editButton}
          onPress={() => router.push("/screens/settings/profile/editprofile")}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>

        {/* 3. Logout Button */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  noProfileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noProfileText: { fontSize: 18, marginBottom: 20 },
  createProfileButton: {
    backgroundColor: "black",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createProfileText: { color: "white", fontWeight: "600" },
  container: { flex: 1, backgroundColor: "#fff", },
  coverImage: { width: "100%", height: 200, backgroundColor: "#ccc" },
  profileContainer: {
    marginTop: -100 / 2,
    paddingHorizontal: 20,
    alignItems: "flex-start",
  },
  avatarWrapper: { marginBottom: 10 },
  avatar: {
    borderRadius: 100,
    flex: 1,
    width: "100%",
    height: 124,
    borderWidth: 6,
    borderColor: "#fff",
    backgroundColor: "#eee",
    left: 22,
  },
  avatarPlaceholder: { backgroundColor: "#bbb" },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
    textAlign: "center",
  },
  pronouns: { fontSize: 14, color: "#666", marginBottom: 10 },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  favouritesRow: { flexDirection: "row", marginBottom: 20 },
  favImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#ddd",
  },
  editButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
});
