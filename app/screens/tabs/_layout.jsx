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
              name="home"
              size={30}
              color="#000000"
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
              name="group"
              size={30}
              color="#000000"
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
              name="add"
              size={30}
              color="#000000"
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
              name="notifications"
              size={30}
              color="#000000"
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
              name="person"
              size={30}
              color="#000000"
            />
          ),
        }}
      />
    </Tabs>
  );
}

//
