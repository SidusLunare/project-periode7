import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  return (
    <ImageBackground
      style={styles.background}
      source={require("../../../assets/images/Landing-Background-2.png")}
    >
      <View style={styles.logo}>
        <Image
          style={styles.logoImage}
          source={require("../../../assets/images/main-logo.png")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.landingScreenButton}
          onPress={() => {
            console.log("Home Redirect Button pressed");
            router.push("/screens/tabs/home");
          }}
        >
          <Text style={styles.landingScreenText}>Login</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: "100",
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
    fontFamily: "Inter-Bold",
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
