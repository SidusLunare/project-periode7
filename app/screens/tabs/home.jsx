import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Linking,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URL } from "../../../utils/config.js";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function TripsOverview() {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true); // default; will be updated
  const [modalVisible, setModalVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);

  // Persisted key for tracking modal dismissal
  const MODAL_DISMISSED_KEY = "profileModalDismissed";

  // Fetch trips data on mount
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/trips`);
        if (!response.ok) throw new Error("Failed to fetch trips");
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTrips();
  }, []);

  // When screen is focused, load profile info and check for modal dismissal flag
  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          // Check if we've already dismissed the modal
          const dismissedFlag = await AsyncStorage.getItem(MODAL_DISMISSED_KEY);
          if (dismissedFlag === "true") {
            setModalDismissed(true);
          }
          const stored = await AsyncStorage.getItem("userProfile");
          if (!stored) {
            setHasProfile(false);
            return;
          }
          const localUser = JSON.parse(stored);
          const response = await fetch(
            `${SERVER_URL}/profile?email=${localUser.email}`
          );
          if (!response.ok) {
            setHasProfile(false);
            return;
          }
          const serverData = await response.json();
          setHasProfile(!!serverData.hasProfile);
        } catch (error) {
          console.error("Error loading profile:", error);
          setHasProfile(false);
        } finally {
          setIsLoading(false);
        }
      };
      loadProfile();
    }, [])
  );

  // Control modal visibility.
  useEffect(() => {
    // Show the modal if there is no profile and the modal hasn't been dismissed.
    if (!isLoading && !hasProfile && !modalDismissed) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [hasProfile, isLoading, modalDismissed]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleTripPress = (trip) => {
    router.push(`/diaryoverview?id=${trip.id}`);
  };

  const renderTripCard = ({ item }) => (
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

  // Function to persist the modal dismissal state
  const dismissModal = async () => {
    setModalVisible(false);
    setModalDismissed(true);
    try {
      await AsyncStorage.setItem(MODAL_DISMISSED_KEY, "true");
    } catch (error) {
      console.error("Error setting modal dismissed flag:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialIcons name="work" size={32} color="#000" />
        <Text style={styles.header}>My Trips</Text>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Welcome to Travel Diary {"\n"}
              Let us show you our key features: {"\n\n"}
              <MaterialIcons name="home" size={16} /> - Shows you all your saved
              trips {"\n"}
              <MaterialIcons name="group" size={16} /> - Manage your own travel
              groups here {"\n"}
              <MaterialIcons name="add" size={16} /> - Create your travel
              diaries here {"\n"}
              <MaterialIcons name="notifications" size={16} /> - Pings of the
              people you follow are here {"\n"}
              <MaterialIcons name="person" size={16} /> - Fill in your profile
              here{"\n\n"}
            </Text>

            {/* Terms and Services Checkbox */}
            <View style={styles.termsContainer}>
              <Pressable onPress={() => setAcceptedTerms(!acceptedTerms)}>
                <MaterialIcons
                  name={acceptedTerms ? "check-box" : "check-box-outline-blank"}
                  size={24}
                  color="black"
                />
              </Pressable>
              <Text style={styles.termsText}>
                {"  "}I accept the{" "}
                <Text
                  style={styles.linkText}
                  onPress={() =>
                    Linking.openURL(
                      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    )
                  }
                >
                  Terms of Services
                </Text>
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, !acceptedTerms && styles.disabledButton]}
                disabled={!acceptedTerms}
                onPress={async () => {
                  if (acceptedTerms) {
                    await dismissModal(); // Persist dismissal so modal won't reopen.
                    router.push("/screens/settings/profile/createprofile");
                  } else {
                    Alert.alert(
                      "Notice",
                      "Please accept the Terms of Services first."
                    );
                  }
                }}
              >
                <Text style={styles.modalTextstyle}>Create Profile</Text>
              </Pressable>
              <Pressable style={styles.skipButton} onPress={dismissModal}>
                <Text style={styles.modalSkipTextstyle}>Skip</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id.toString()}
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
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "85%",
    height: "50%",
  },
  modalText: {
    marginBottom: 16,
    textAlign: "left",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  termsText: {
    fontSize: 14,
  },
  linkText: {
    textDecorationLine: "underline",
    color: "blue",
  },
  buttonContainer: {
    gap: 8,
  },
  button: {
    backgroundColor: "rgb(0, 0, 0)",
    shadowColor: "rgba(66,66,66,0.6)",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16.8,
    elevation: 16.8,
    shadowOpacity: 1,
    borderRadius: 10,
    width: 120,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  modalTextstyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalSkipTextstyle: {
    fontWeight: "200",
    textAlign: "center",
    fontSize: 12,
  },
  skipButton: {
    backgroundColor: "transparent",
    padding: 8,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    gap: 16,
  },
  header: {
    fontSize: 30,
    fontWeight: "700",
    color: "#000",
    textAlign: "left",
  },
  card: {
    shadowColor: "rgba(66, 66, 66, 0.6)",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16.8,
    elevation: 16.8,
    shadowOpacity: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    width: "35%",
    height: 35,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 8,
    position: "relative",
    bottom: -46,
    left: 16,
    borderRadius: 6,
  },
  locationText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
    padding: 4,
  },
  dateTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 32,
    gap: 4,
  },
  dateText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#a5a5a5",
  },
});
