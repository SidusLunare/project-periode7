import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { useSearchParams } from "expo-router";
import { SERVER_URL } from "../../../utils/config.js";

export default function DiaryOverview() {
  const { id } = useSearchParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // For the local overlay form
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [entryDate, setEntryDate] = useState("");
  const [entryText, setEntryText] = useState("");

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/trips/${id}`);
        if (!response.ok) throw new Error("Failed to fetch trip");
        const data = await response.json();
        setTrip(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const openModal = () => {
    setEntryDate("");
    setEntryText("");
    setShowEntryModal(true);
  };

  const closeModal = () => {
    setShowEntryModal(false);
  };

  const handleSaveEntry = async () => {
    if (!entryDate.trim() || !entryText.trim()) {
      Alert.alert("Error", "Please fill in date and text.");
      return;
    }
    const entryId = Math.random().toString(36).substring(2, 7);

    const newEntry = { entryId, date: entryDate, text: entryText };

    try {
      const response = await fetch(`${SERVER_URL}/trips/${id}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
      if (!response.ok) {
        throw new Error("Failed to add diary entry");
      }
      // Update local state
      setTrip((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          entries: [...prev.entries, newEntry],
        };
      });
      closeModal();
      Alert.alert("Success", "Diary entry added!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (!trip) {
    return (
      <View style={styles.container}>
        <Text>Trip not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Show the trip's image, location, date range */}
      <Image source={{ uri: trip.image }} style={styles.tripImage} />
      <Text style={styles.tripLocation}>{trip.location}</Text>
      <Text>
        {trip.startDate} - {trip.endDate}
      </Text>

      {/* If no entries, show message. Else list them. */}
      {trip.entries.length === 0 ? (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: "red" }}>
            You need to add your first entry for this trip!
          </Text>
          <Pressable style={styles.addButton} onPress={openModal}>
            <Text style={styles.addButtonText}>Add First Entry</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ marginTop: 20, flex: 1 }}>
          <FlatList
            data={trip.entries}
            keyExtractor={(item) => item.entryId}
            renderItem={({ item }) => (
              <View style={styles.entryItem}>
                <Text style={styles.entryDate}>{item.date}</Text>
                <Text>{item.text}</Text>
              </View>
            )}
          />
          {/* Pressable to add more entries */}
          <Pressable style={styles.addButton} onPress={openModal}>
            <Text style={styles.addButtonText}>Add Entry</Text>
          </Pressable>
        </View>
      )}

      {/* The local overlay for adding/editing entries */}
      <Modal visible={showEntryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>New Diary Entry</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Date (YYYY-MM-DD)"
              value={entryDate}
              onChangeText={setEntryDate}
            />
            <TextInput
              style={[styles.modalInput, { height: 80 }]}
              placeholder="What happened today?"
              multiline
              value={entryText}
              onChangeText={setEntryText}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable
                style={[styles.button, { backgroundColor: "gray" }]}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, { backgroundColor: "green" }]}
                onPress={handleSaveEntry}
              >
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  tripImage: { width: "100%", height: 200, borderRadius: 8 },
  tripLocation: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
  addButton: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  entryItem: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  entryDate: { fontWeight: "bold", marginBottom: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
  },
  modalHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 5,
    alignItems: "center",
    width: 80,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
