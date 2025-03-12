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
import { loginUser } from '../../../utils/localAuth';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return;
    }
    try {
      await loginUser(email, password);
      alert('Login successful!');
      router.push('/screens/tabs/home');
    } catch (error) {
      alert(error.message);
    }
  };

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
        <Pressable
          style={styles.landingScreenButton}
          onPress={handleLogin}
        >
          <Text style={styles.landingScreenText}>Login</Text>
        </Pressable>
      </View>
      <Pressable
        style={styles.alreadyAccountContainer}
        onPress={() => {
          router.push("/screens/auth/register");
        }}
      >
        <Text style={styles.alreadyAccountText}>
          Already have an account? Sign in
        </Text>
      </Pressable>
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
    marginBottom: "100", // Note: original code used a string here
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
  input: {
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.83)",
    width: "80%",
    height: 46,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  alreadyAccountContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    bottom: 25,
  },
  alreadyAccountText: {
    fontSize: 12,
    letterSpacing: 0.8,
    lineHeight: 55,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    color: "#fff",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    width: 224,
  },
});
