import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SERVER_URL } from "../../../utils/config"; // adapt if needed
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function AddDiaryEntry() {
  const router = useRouter();

  // Form states
  const [bannerImage, setBannerImage] = useState(null);
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [diaryEntry, setDiaryEntry] = useState("");

  // 1. Pick banner image
  const pickBannerImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "We need permission to pick an image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setBannerImage(result.assets[0].uri);
    }
  };

  // 2. Handle submit (POST to your Node.js server)
  const handleSubmit = async () => {
    if (
      !bannerImage ||
      !location.trim() ||
      !duration.trim() ||
      !diaryEntry.trim()
    ) {
      Alert.alert("Error", "Please fill all fields and pick an image.");
      return;
    }

    try {
      // Example body for a new trip or diary entry:
      const body = {
        location,
        image: bannerImage,
        duration,
        diary: diaryEntry,
      };
      // Adapt the endpoint to your server logic, e.g. /trips or /trips/:id/edit
      const response = await fetch(`${SERVER_URL}/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error("Failed to submit diary entry");
      }
      Alert.alert("Success", "Diary entry submitted!");
      router.back(); // or router.push("/tripsOverview")
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header row (title + X button). If you want an actual close button: */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>New diary entry</Text>
      </View>

      {/* Location of vacation */}
      <Text style={styles.label}>Location of vacation</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Barcelona"
        value={location}
        onChangeText={setLocation}
      />

      {/* Banner image area */}
      <Pressable style={styles.bannerArea} onPress={pickBannerImage}>
        {bannerImage ? (
          <Image source={{ uri: bannerImage }} style={styles.bannerImage} />
        ) : (
          <View style={styles.plusContainer}>
            <Text style={styles.plusText}>+</Text>
          </View>
        )}
      </Pressable>

      {/* Duration */}
      <Text style={styles.label}>Duration</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. March 2024 - April 2024"
        value={duration}
        onChangeText={setDuration}
      />

      {/* Diary entry */}
      <Text style={styles.label}>Diary entry</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Write your story..."
        multiline
        value={diaryEntry}
        onChangeText={setDiaryEntry}
      />

      {/* Submit button */}
      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  headerRow: {
    justifyContent: "flex-start",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    gap: 16,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  closeButton: { fontSize: 18, fontWeight: "bold", color: "#000" },

  bannerArea: {
    width: "100%",
    height: 200,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  plusContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: { fontSize: 48, color: "#999", fontWeight: "bold" },

  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
