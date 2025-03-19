import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedProfile = await AsyncStorage.getItem("userProfile");
        if (storedProfile) {
          // If user is already logged in, skip to home
          router.push("/screens/tabs/home");
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        console.log("Error checking AsyncStorage:", error);
        setIsChecking(false);
      }
    })();
  }, []);

  if (isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/images/Landing-Background-1.png")}
    >
      <View style={styles.logo}>
        <Image
          style={styles.logoImage}
          source={require("../assets/images/main-logo.png")}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.landingScreenTitle}>Explore a new world with us</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.landingScreenButton}
          onPress={() => {
            router.push("/screens/auth/register");
          }}
        >
          <Text style={styles.landingScreenText}>Register</Text>
        </Pressable>
        <Pressable
          style={styles.landingScreenButton}
          onPress={() => {
            router.push("/screens/auth/login");
          }}
        >
          <Text style={styles.landingScreenText}>Login</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
    width: "100%",
    height: "100%",
    marginBottom: 100,
  },
  textContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  landingScreenTitle: {
    fontSize: 45,
    letterSpacing: 3.2,
    lineHeight: 55,
    fontWeight: "700",
    color: "#fff",
    textAlign: "left",
    width: 312,
    height: 182,
    marginTop: 237,
  },
  landingScreenButton: {
    borderRadius: 10,
    backgroundColor: "black",
    width: "80%",
    height: 55,
    fontSize: 100,
    color: "white",
  },
  landingScreenText: {
    fontSize: 15,
    letterSpacing: 1.1,
    lineHeight: 55,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  logo: {
    position: "absolute",
    top: 40,
    left: 20,
    gap: 10,
    width: "100%",
    height: 55,
  },
});
