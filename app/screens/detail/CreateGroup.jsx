import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import friendsData from '../../../assets/friends.json';

const CreateGroupScreen = () => {
  const [groupName, setGroupName] = useState('');
  const [tags, setTags] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [friends, setFriends] = useState(friendsData); 
  const router = useRouter();

  const saveGroupToStorage = async (newGroup) => {
    try {
      const storedGroups = await AsyncStorage.getItem('groups');
      let groups = storedGroups ? JSON.parse(storedGroups) : [];
      groups.push(newGroup);
      await AsyncStorage.setItem('groups', JSON.stringify(groups));
      router.push('../tabs/groups');
    } catch (error) {
      console.error('Error saving group to storage', error);
    }
  };

  const createGroup = () => {
    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      tags: tags.split(',').map(tag => tag.trim()),
      members: selectedMembers,
    };
    saveGroupToStorage(newGroup);
  };

  const toggleMember = (name) => {
    if (selectedMembers.includes(name)) {
      setSelectedMembers(selectedMembers.filter(member => member !== name));
    } else {
      setSelectedMembers([...selectedMembers, name]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Group</Text>
        <TouchableOpacity onPress={() => router.push('../tabs/groups')}>
          <Ionicons name="arrow-back-circle" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Group name"
      />

      <Text style={styles.label}>Tags</Text>
      <TextInput
        style={styles.input}
        value={tags}
        onChangeText={setTags}
        placeholder="Tags (comma separated)"
      />

      <Text style={styles.label}>Choose Members</Text>
      <View style={styles.membersContainer}>
        {friends.map((friend) => (
          <TouchableOpacity
            key={friend.id}
            style={styles.member}
            onPress={() => toggleMember(friend.name)}
          >
            <Image source={{ uri: friend.image }} style={styles.avatar} />
            {selectedMembers.includes(friend.name) && (
              <View style={styles.checkmarkOverlay}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            )}
            <Text style={styles.name}>{friend.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={createGroup}>
        <Text style={styles.buttonText}>Create Group</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  membersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  member: {
    alignItems: 'center',
    margin: 10,
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#00ff00',
  },
  checkmarkOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#000',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    marginTop: 5,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CreateGroupScreen;
