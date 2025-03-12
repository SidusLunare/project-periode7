import { Stack } from "expo-router";
import PreloadImages from "./components/PreloadImages";

export default function Layout() {
  return (
    <PreloadImages>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="screens/auth/login" />
        <Stack.Screen name="screens/auth/register" />
      </Stack>
    </PreloadImages>
  );
}
