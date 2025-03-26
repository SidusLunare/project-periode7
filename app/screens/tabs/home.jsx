import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { SERVER_URL } from "../../../utils/config.js";

export default function TripsOverview() {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/trips`);
        if (!response.ok) throw new Error("Failed to fetch trips");
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleTripPress = (trip) => {
    router.push(`/diaryOverview?id=${trip.id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trips Overview</Text>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.tripCard}
            onPress={() => handleTripPress(item)}
          >
            {/* Show the trip's image */}
            <Image source={{ uri: item.image }} style={styles.tripImage} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.tripTitle}>{item.location}</Text>
              <Text>
                {item.startDate} - {item.endDate}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  tripCard: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    padding: 16,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
  },
  tripImage: { width: 60, height: 60, borderRadius: 8 },
  tripTitle: { fontSize: 18, fontWeight: "bold" },
  createButton: {
    backgroundColor: "green",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  createButtonText: { color: "#fff", fontWeight: "bold" },
});
