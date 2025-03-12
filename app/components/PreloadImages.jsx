// components/PreloadImages.jsx
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Asset } from "expo-asset";

const preloadImages = async () => {
  const images = [
    require("../../assets/images/Landing-Background-1.png"),
    require("../../assets/images/Landing-Background-2.png"),
    require("../../assets/images/Landing-Background-3.png"),
    require("../../assets/images/main-logo.png"),
  ];
  const cacheImages = images.map((img) => Asset.fromModule(img).downloadAsync());
  await Promise.all(cacheImages);
};

export default function PreloadImages({ children }) {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    preloadImages()
      .then(() => setAssetsLoaded(true))
      .catch(console.warn);
  }, []);

  if (!assetsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}
