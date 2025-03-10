import { Tabs } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function Tabslayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabel: () => null,
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({}) => (
            <MaterialIcons
              name="home" // Name of the Material icon you want
              size={30} // Icon size
              color="#000000" // Icon color
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "Groups",
          tabBarIcon: ({}) => (
            <MaterialIcons
              name="group" // Name of the Material icon you want
              size={30} // Icon size
              color="#000000" // Icon color
            />
          ),
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: "Add Diary",
          tabBarIcon: ({}) => (
            <MaterialIcons
              name="add" // Name of the Material icon you want
              size={30} // Icon size
              color="#000000" // Icon color
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({}) => (
            <MaterialIcons
              name="notifications" // Name of the Material icon you want
              size={30} // Icon size
              color="#000000" // Icon color
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({}) => (
            <MaterialIcons
              name="person" // Name of the Material icon you want
              size={30} // Icon size
              color="#000000" // Icon color
            />
          ),
        }}
      />
    </Tabs>
  );
}

//
