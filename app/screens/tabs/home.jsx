import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleTripPress = (trip) => {
    router.push(`/diaryOverview?id=${trip.id}`);
  };

  const renderTripCard = ({ item }) => {
    return (
      <Pressable style={styles.card} onPress={() => handleTripPress(item)}>
        <ImageBackground
          source={{ uri:item.image }}
          style={styles.cardImage}
          imageStyle={{ borderRadius: 12 }}
        >
          <View style={styles.overlay}>
            <Text style={styles.locationText}>{item.location}</Text>
            <Text style={styles.dateText}>
              {item.startDate} - {item.endDate}
            </Text>
          </View>
        </ImageBackground>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Trips</Text>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={renderTripCard}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    shadowColor: "rgba(186, 186, 186, 0.6)",
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
    height: 150,
    margin: 26.5,
  },
  cardImage: {
    width: "95%",
    height: "95%", // Adjust as needed
    justifyContent: "center",
  },
  overlay: {
  },
  locationText: {
    fontSize: 15,
    letterSpacing: 0.5,
    lineHeight: 20,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    color: "#000",
    textAlign: "left",
    width: 93,
    height: 27,
    borderRadius: 6,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingTop: 4,
    paddingRight: 6,
    backgroundColor: "white",
  },
  dateText: {
    fontSize: 10,
    letterSpacing: 0.3,
    lineHeight: 20,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
    color: "#a5a5a5",
    textAlign: "left",
    position: "absolute",
    top: 50,
    left: 10,
  },
});
