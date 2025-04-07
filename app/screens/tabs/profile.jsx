import React, { useState } from "react";
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
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SERVER_URL } from "../../../utils/config";

const COVER_HEIGHT = 220;
const AVATAR_SIZE = 135;

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

  // Fetch profile data every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadProfile = async () => {
        try {
          const stored = await AsyncStorage.getItem("userProfile");
          if (!stored) {
            setHasProfile(false);
            setIsLoading(false);
            return;
          }
          const localUser = JSON.parse(stored);
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
      };
      loadProfile();
    }, [])
  );

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

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Cover Image */}
        <ImageBackground
          source={coverUrl ? { uri: coverUrl } : null}
          style={styles.coverImage}
          resizeMode="cover"
        >
          {/* Gear icon in top-right for editing */}
        </ImageBackground>

        {/* White card overlapping the cover */}
        <View style={styles.profileCard}>
          {/* Avatar overlapping left side of the card */}
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]} />
            )}
          </View>

          {/* Text info inside the card */}
          <View style={styles.infoContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{userName}</Text>
              {/* Optional small edit icon next to name */}
              <Pressable
                onPress={() =>
                  router.push("/screens/settings/profile/editprofile")
                }
                style={styles.nameEditPressable}
              >
                <MaterialIcons name="edit" size={18} color="#000" />
              </Pressable>
            </View>

            <Text style={styles.pronouns}>{pronouns}</Text>

            <View style={styles.bioContainer}>
              <Text style={styles.bio}>{bio}</Text>
            </View>

            {/* Favourites */}
            {favourites.length > 0 && (
              <>
                <View style={styles.favHeaderRow}>
                  <MaterialIcons
                    name="favorite"
                    size={20}
                    color="#f00"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.sectionTitle}>My favourites</Text>
                </View>
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
          </View>
        </View>
      </ScrollView>
      <Pressable
        style={styles.gearIconPressable}
        onPress={() => router.push("/screens/settings/profile/editprofile")}
      >
        <MaterialIcons name="settings" size={32} color="#fff" />
      </Pressable>
    </>
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

  container: { flex: 1, backgroundColor: "#fff" },
  coverImage: {
    width: "100%",
    height: COVER_HEIGHT,
    backgroundColor: "#ccc",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  gearIconPressable: {
    position: "absolute",
    top: 16,
    right: 16,
  },

  // White card that overlaps the cover
  profileCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
  },

  // Avatar on the left edge of the card
  avatarContainer: {
    position: "absolute",
    top: -70,
    left: 6,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: "#eee",
    backgroundColor: "#ddd",
  },
  avatarPlaceholder: { backgroundColor: "#bbb" },

  infoContainer: {
    marginTop: AVATAR_SIZE / 2, // space for the avatar
    paddingTop: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 6,
  },
  nameEditPressable: {
    padding: 4,
  },
  pronouns: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  bioContainer: {
    shadowColor: "rgba(66, 66, 66, 0.6)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 16,
    elevation: 16,
    shadowOpacity: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
    height: "auto",
    padding: 16,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    marginBottom: 16,
  },
  favHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  favouritesRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  favImage: {
    width: 100,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#ddd",
  },
});
