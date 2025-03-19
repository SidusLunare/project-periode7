import { Stack } from "expo-router";
import PreloadImages from "./components/PreloadImages";

export default function Layout() {
  return (
    <PreloadImages>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="screens/auth/login" />
        <Stack.Screen name="screens/auth/register" />
        <Stack.Screen name="screens/settings/profile/createprofile" />
        <Stack.Screen name="screens/settings/profile/changepassword" />
        <Stack.Screen name="screens/settings/profile/editprofile" />
      </Stack>
    </PreloadImages>
  );
}
