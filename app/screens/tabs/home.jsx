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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

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
    router.push(`/diaryoverview?id=${trip.id}`);
  };

  const renderTripCard = ({ item }) => {
    return (
      <View>
        <Pressable style={styles.card} onPress={() => handleTripPress(item)}>
          <ImageBackground
            source={{ uri: `${SERVER_URL}/images/${item.image}` }}
            style={styles.cardImage}
            imageStyle={{ borderRadius: 10 }}
          >
            <View style={styles.overlay}>
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          </ImageBackground>
        </Pressable>
        <View style={styles.dateTextContainer}>
          <MaterialIcons name="schedule" size={12} color="#a5a5a5" />
          <Text style={styles.dateText}>
            {item.startDate} - {item.endDate}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialIcons name="work" size={32} color="#000" />
        <Text style={styles.header}>My Trips</Text>
      </View>
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
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center",
    gap: 16,
    marginLeft: 16,
  },
  header: {
    fontSize: 30,
    letterSpacing: 0.9,
    lineHeight: 55,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    color: "#000",
    textAlign: "left",
    width: 138,
    height: 55,
  },
  headerIcon: {},
  card: {
    shadowColor: "rgba(66, 66, 66, 0.6)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 16.8,
    elevation: 16.8,
    shadowOpacity: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    flex: 1,
    width: "85%",
    height: 150,
    marginHorizontal: 26.5,
    marginTop: 26.5,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  overlay: {
    shadowColor: "rgba(0, 0, 0, 0.6)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 1,
    borderRadius: 6,
    backgroundColor: "#fff",
    width: "35%",
    height: 35,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 8,
    position: "relative",
    bottom: -46,
    left: 16,
  },
  locationText: {
    fontSize: 15,
    letterSpacing: 0.5,
    lineHeight: 20,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    color: "#000",
    textAlign: "left",
    width: "auto",
    height: "auto",
    padding: 4,
  },
  dateTextContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    alignItems: "center",
    gap: 4,
    marginLeft: 32,
  },
  dateText: {
    fontSize: 10,
    letterSpacing: 0.3,
    lineHeight: 20,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
    color: "#a5a5a5",
    textAlign: "left",
  },
});
