// Import React and required hooks, components from React Native, navigation, icons, and AsyncStorage for data persistence.
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Component: GroupOverview displays a list of groups and provides functionality to manage group details.
const GroupOverview = () => {
  // State to store the list of groups.
  const [groups, setGroups] = useState([]);
  // State to indicate which group's details are currently expanded.
  const [expandedGroup, setExpandedGroup] = useState(null);
  // State to hold the updated name input when editing a group's name.
  const [updatedGroupName, setUpdatedGroupName] = useState("");
  // State to hold the updated tags (as a comma-separated string) when editing a group's tags.
  const [updatedTags, setUpdatedTags] = useState("");
  // State to store the new member input when adding a member to a group.
  const [newMember, setNewMember] = useState("");
  // State to hold the currently selected group for updating details.
  const [selectedGroup, setSelectedGroup] = useState(null);
  // Use router hook to navigate between screens.
  const router = useRouter();

  // useEffect to load groups from AsyncStorage once the component is mounted.
  useEffect(() => {
    const loadGroups = async () => {
      try {
        // Retrieve the stored groups string from AsyncStorage.
        const storedGroups = await AsyncStorage.getItem("groups");
        // If groups were found, parse the JSON string and update the state.
        if (storedGroups) {
          const parsedGroups = JSON.parse(storedGroups);
          setGroups(parsedGroups);
        }
      } catch (error) {
        // Log any errors encountered during data retrieval.
        console.error("Error loading groups from storage", error);
      }
    };

    // Invoke the function to load groups.
    loadGroups();
  }, []);

  // Function to delete a group by its ID.
  const deleteGroup = async (groupId) => {
    try {
      // Get the current list of groups from AsyncStorage.
      const storedGroups = await AsyncStorage.getItem("groups");
      if (storedGroups) {
        // Parse the stored JSON string into an array.
        const groups = JSON.parse(storedGroups);
        // Filter out the group with the matching ID.
        const filteredGroups = groups.filter((group) => group.id !== groupId);
        // Save the updated groups back to AsyncStorage.
        await AsyncStorage.setItem("groups", JSON.stringify(filteredGroups));
        // Update the local state.
        setGroups(filteredGroups);
      }
    } catch (error) {
      // Log any errors that occur during the deletion.
      console.error("Error deleting group", error);
    }
  };

  // Function to confirm deletion of a group using an alert dialog.
  const confirmDelete = (groupId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this group?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteGroup(groupId), // Call deleteGroup when confirmed.
          style: "destructive",
        },
      ]
    );
  };

  // Function to toggle the detail view for a specific group.
  const toggleGroupDetails = (groupId) => {
    // If the group is already expanded, collapse it; otherwise, expand it.
    setExpandedGroup((prevGroupId) =>
      prevGroupId === groupId ? null : groupId
    );
    // When expanding a group, set the selected group's details into the state.
    if (expandedGroup !== groupId) {
      const group = groups.find((g) => g.id === groupId);
      setSelectedGroup(group);
      // Pre-fill the editing fields with the current group's data.
      setUpdatedGroupName(group.name);
      setUpdatedTags(group.tags.join(", "));
      setNewMember("");
    }
  };

  // Function to update the group's name.
  const updateGroupName = async (groupId) => {
    // Do nothing if the input field is empty.
    if (updatedGroupName.trim() === "") return;

    // Create a new array of groups with the updated name for the specified group.
    const updatedGroups = groups.map((group) =>
      group.id === groupId ? { ...group, name: updatedGroupName } : group
    );

    // Update the state and AsyncStorage with the new group data.
    setGroups(updatedGroups);
    await AsyncStorage.setItem("groups", JSON.stringify(updatedGroups));
    // Collapse the expanded details section.
    setExpandedGroup(null);
  };

  // Function to update the group's tags.
  const updateTags = async (groupId) => {
    // Convert the comma-separated string into an array of tags, trimming whitespace.
    const tagsArray = updatedTags.split(",").map((tag) => tag.trim());

    // Update the matching group's tags.
    const updatedGroups = groups.map((group) =>
      group.id === groupId ? { ...group, tags: tagsArray } : group
    );

    // Update state and persist the changes in AsyncStorage.
    setGroups(updatedGroups);
    await AsyncStorage.setItem("groups", JSON.stringify(updatedGroups));
    // Collapse the expanded details section.
    setExpandedGroup(null);
  };

  // Function to add a new member to a group.
  const addMember = async (groupId) => {
    // Do nothing if the new member input is empty.
    if (!newMember.trim()) return;

    // Update the specified group by adding the new member to its members array.
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        return { ...group, members: [...group.members, newMember.trim()] };
      }
      return group;
    });

    // Update the state and persist the updated group list.
    setGroups(updatedGroups);
    await AsyncStorage.setItem("groups", JSON.stringify(updatedGroups));
    // Clear the new member input field.
    setNewMember("");
  };

  // Function to remove a member from a group.
  const removeMember = async (groupId, member) => {
    // Update the group's members by filtering out the specified member.
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        return { ...group, members: group.members.filter((m) => m !== member) };
      }
      return group;
    });

    // Update state and persist the changes in AsyncStorage.
    setGroups(updatedGroups);
    await AsyncStorage.setItem("groups", JSON.stringify(updatedGroups));
  };

  // Function to render each group card in the list.
  const renderItem = ({ item }) => (
    // Make the entire card clickable to navigate to the group's detail page.
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`../detail/${item.id}`)}
    >
      {/* Display group name */}
      <Text style={styles.groupName}>{item.name}</Text>
      {/* Display group's tags */}
      <Text style={styles.groupTags}>Tags: {item.tags.join(", ")}</Text>
      {/* Display group's members */}
      <Text style={styles.groupMembers}>
        Members: {item.members.join(", ")}
      </Text>

      {/* Render delete action button */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => confirmDelete(item.id)}
        >
          <Ionicons name="trash-bin" size={24} color="red" />
        </TouchableOpacity>
      </View>

      {/* Expandable section for editing group details */}
      {expandedGroup === item.id && (
        <View style={styles.expandedSection}>
          {/* Input field and button to update the group name */}
          <TextInput
            style={styles.input}
            value={updatedGroupName}
            onChangeText={setUpdatedGroupName}
            placeholder="Edit name"
          />
          <Button
            title="Update Name"
            onPress={() => updateGroupName(item.id)}
          />

          {/* Input field and button to update the group tags */}
          <TextInput
            style={styles.input}
            value={updatedTags}
            onChangeText={setUpdatedTags}
            placeholder="Edit tags (separated by commas)"
          />
          <Button title="Update Tags" onPress={() => updateTags(item.id)} />

          {/* Input field and button to add a new member */}
          <TextInput
            style={styles.input}
            value={newMember}
            onChangeText={setNewMember}
            placeholder="Add member"
          />
          <Button title="Add Member" onPress={() => addMember(item.id)} />

          {/* List of current members with the option to remove each */}
          <View>
            <Text style={styles.label}>Members:</Text>
            {item.members.map((member, index) => (
              <View key={index} style={styles.memberRow}>
                <Text style={styles.memberName}>{member}</Text>
                <TouchableOpacity onPress={() => removeMember(item.id, member)}>
                  <Ionicons name="remove-circle" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  // Render the overall component view.
  return (
    <View style={styles.container}>
      {/* Title of the screen */}
      <Text style={styles.title}>Your Groups</Text>

      {/* Button to add a new group, navigating to the create group screen */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("../detail/CreateGroup")}
      >
        <Ionicons name="add-circle" size={40} color="#000" />
      </TouchableOpacity>

      {/* Display a message if there are no groups, otherwise render the list of groups */}
      {groups.length === 0 ? (
        <Text style={styles.emptyMessage}>
          You have no groups yet. Create one, or ask someone to invite you!
        </Text>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

// Define styles for the component.
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "600",
  },
  groupTags: {
    marginTop: 5,
    color: "#666",
  },
  groupMembers: {
    marginTop: 5,
    color: "#444",
  },
  addButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  actionButton: {
    marginLeft: 15,
    padding: 5,
  },
  expandedSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    alignItems: "center",
  },
  memberName: {
    fontSize: 16,
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    marginTop: 30,
  },
});

// Export the component so it can be used in other parts of the app.
export default GroupOverview;
