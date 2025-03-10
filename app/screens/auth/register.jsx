import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      return;
    }
    if (password !== confirmPassword) {
      return;
    }
  };
  return (
    <ImageBackground
      style={styles.background}
      source={require("../../../assets/images/Landing-Background-3.png")}
    >
      <View style={styles.logo}>
        <Image
          style={styles.logoImage}
          source={require("../../../assets/images/main-logo.png")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Wachtwoord"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Bevestig wachtwoord"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Pressable
          style={styles.landingScreenButton}
          onPress={() => {
            handleRegister();
            console.log("Home Redirect Button pressed");
            router.push("/screens/tabs/home");
          }}
        >
          <Text style={styles.landingScreenText}>Register</Text>
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
  input: {
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.83)",
    width: "80%",
    height: 46,
    padding: 20,
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
