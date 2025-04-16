// Import React and useState hook for managing component state.
import React, { useState } from "react";
// Import necessary components from React Native.
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
// Import the Expo ImagePicker to allow image selection from the device library.
import * as ImagePicker from "expo-image-picker";
// Import Ionicons for using vector icons.
import { Ionicons } from "@expo/vector-icons";

// The NotificationScreen component manages and displays notifications.
export default function NotificationScreen() {
  // State to store the list of active notifications.
  const [notifications, setNotifications] = useState([]);
  // State to store notifications that have been removed (history).
  const [history, setHistory] = useState([]);
  // Flag to determine whether to show notification history or current notifications.
  const [showHistory, setShowHistory] = useState(false);
  // State for the text input of a new notification.
  const [text, setText] = useState("");
  // State for the selected image URI for the new notification.
  const [image, setImage] = useState(null);

  // Utility function to format the current date and time.
  const formatDate = () => {
    const now = new Date();
    // Helper to pad single-digit numbers with a leading zero.
    const pad = (n) => String(n).padStart(2, "0");
    // Return a formatted date string as "dd/mm/yyyy hh:mm:ss".
    return `${pad(now.getDate())}/${pad(
      now.getMonth() + 1
    )}/${now.getFullYear()} ${pad(now.getHours())}:${pad(
      now.getMinutes()
    )}:${pad(now.getSeconds())}`;
  };

  // Function to add a new notification if there's text or an image.
  const addNotification = () => {
    // Only add if there is some text or an image selected.
    if (text.trim() || image) {
      const newNotification = {
        // Use current timestamp as a unique ID.
        id: Date.now().toString(),
        // Notification message text.
        message: text,
        // Selected image URI (if any).
        image,
        // Formatted timestamp.
        time: formatDate(),
      };

      // Update the notifications state by prepending the new notification.
      setNotifications((prev) => [newNotification, ...prev]);

      // Clear the text and image inputs.
      setText("");
      setImage(null);
    }
  };

  // Function to remove a notification by its id.
  // Removed notifications are added to the history.
  const removeNotification = (id) => {
    setNotifications((prev) => {
      // Find the notification to remove.
      const removed = prev.find((item) => item.id === id);
      // If a notification is found, add it to the history.
      if (removed) setHistory((hist) => [...hist, removed]);
      // Return a new list excluding the removed notification.
      return prev.filter((item) => item.id !== id);
    });
  };

  // Function to launch the image picker and update the selected image.
  const pickImage = async () => {
    // Launch the device's image library.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // If the user did not cancel, update the image state with the selected image URI.
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Determine which notifications to display.
  // Show history if the user toggles that flag; otherwise show active notifications.
  const displayedNotifications = showHistory ? history : notifications;

  return (
    <View style={styles.container}>
      {/* Header containing the title and a button to toggle between history and active notifications */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {showHistory ? "Notification History" : "Recent Notifications"}
        </Text>
        <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
          <Ionicons
            name={showHistory ? "close" : "time-outline"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* If there are no active notifications and history is not being shown, display an empty state message */}
      {notifications.length === 0 && !showHistory && (
        <Text style={styles.emptyMessage}>You're all caught up!</Text>
      )}

      {/* List of notifications, showing either history or active notifications */}
      <FlatList
        data={displayedNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            {/* If a notification contains an image, display it */}
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={styles.notificationImage}
              />
            )}
            {/* Container for the notification message and timestamp */}
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{item.message}</Text>
              <Text style={styles.timestamp}>{item.time}</Text>
            </View>
            {/* If not showing history, provide a button to remove the notification */}
            {!showHistory && (
              <TouchableOpacity onPress={() => removeNotification(item.id)}>
                <Ionicons name="close" size={20} color="red" />
              </TouchableOpacity>
            )}
          </View>
        )}
        // Additional bottom padding for the list.
        contentContainerStyle={{ paddingBottom: 200 }}
      />

      {/* Input container to create and send a new notification */}
      <View style={styles.inputContainer}>
        {/* Text input for the notification message */}
        <TextInput
          style={styles.input}
          placeholder="Enter notification"
          value={text}
          onChangeText={setText}
        />
        {/* Button to choose an image */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text>Choose image</Text>
        </TouchableOpacity>
        {/* Preview of the selected image, if any */}
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        {/* Button to send the new notification */}
        <TouchableOpacity style={styles.sendButton} onPress={addNotification}>
          <Text style={styles.sendButtonText}>Send notification</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Define component styles.
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: { fontSize: 18, fontWeight: "bold" },
  emptyMessage: { textAlign: "center", marginTop: 20, color: "gray" },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageContainer: { flex: 1 },
  messageText: { fontSize: 16 },
  timestamp: { fontSize: 12, color: "gray", alignSelf: "flex-end" },
  inputContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePicker: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  sendButtonText: { color: "white", fontWeight: "bold" },
});
