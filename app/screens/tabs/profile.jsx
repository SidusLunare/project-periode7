import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_URL = "http://localhost:3000"; // or your IP
const coverHeight = 200;
const avatarSize = 100;

export default function Profile() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("userProfile");
        if (!stored) {
          setHasProfile(false);
          setIsLoading(false);
          return;
        }
        const localUser = JSON.parse(stored);

        // Fetch from server
        const response = await fetch(`${SERVER_URL}/profile?email=${localUser.email}`);
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userProfile");
      router.push("/");
    } catch (error) {
      Alert.alert("Logout Failed", "Something went wrong.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  if (!hasProfile) {
    return (
      <View style={styles.noProfileContainer}>
        <Text style={styles.noProfileText}>You need to make a profile first!</Text>
        <Pressable
          style={styles.createProfileButton}
          onPress={() => router.push("/screens/settings/profile/createprofile")}
        >
          <Text style={styles.createProfileText}>Create Profile</Text>
        </Pressable>
      </View>
    );
  }

  // Show advanced layout
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
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

        {favourites.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>My favourites</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.favouritesRow}>
              {favourites.map((favUrl, index) => (
                <Image key={index} source={{ uri: favUrl }} style={styles.favImage} />
              ))}
            </ScrollView>
          </>
        )}

        <Pressable
          style={styles.editButton}
          onPress={() => router.push("/screens/settings/profile/createprofile")}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>

        <Pressable
          style={styles.editButton}
          onPress={() => router.push("/screens/settings/profile/changepassword")}
        >
          <Text style={styles.editButtonText}>Change Password</Text>
        </Pressable>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, justifyContent: "center", alignItems: "center",
  },
  noProfileContainer: {
    flex: 1, justifyContent: "center", alignItems: "center",
  },
  noProfileText: {
    fontSize: 18, marginBottom: 20,
  },
  createProfileButton: {
    backgroundColor: "black", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8,
  },
  createProfileText: {
    color: "white", fontWeight: "600",
  },
  container: {
    flex: 1, backgroundColor: "#fff",
  },
  coverImage: {
    width: "100%", height: coverHeight, backgroundColor: "#ccc",
  },
  profileContainer: {
    marginTop: -avatarSize / 2, paddingHorizontal: 20, alignItems: "center",
  },
  avatarWrapper: { marginBottom: 10 },
  avatar: {
    width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2,
    borderWidth: 3, borderColor: "#fff", backgroundColor: "#eee",
  },
  avatarPlaceholder: { backgroundColor: "#bbb" },
  userName: {
    fontSize: 20, fontWeight: "bold", marginBottom: 2, textAlign: "center",
  },
  pronouns: {
    fontSize: 14, color: "#666", marginBottom: 10,
  },
  bio: {
    fontSize: 14, lineHeight: 20, color: "#333",
    textAlign: "center", marginHorizontal: 20, marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: "bold", marginBottom: 8, textAlign: "center",
  },
  favouritesRow: { flexDirection: "row", marginBottom: 20 },
  favImage: {
    width: 120, height: 80, borderRadius: 8,
    marginRight: 10, backgroundColor: "#ddd",
  },
  editButton: {
    backgroundColor: "#007AFF", paddingHorizontal: 14,
    paddingVertical: 10, borderRadius: 8, marginBottom: 10,
  },
  editButtonText: {
    color: "#fff", fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "black", paddingHorizontal: 20,
    paddingVertical: 10, borderRadius: 8, marginTop: 10,
  },
  logoutText: {
    color: "#fff", fontWeight: "bold",
  },
});
