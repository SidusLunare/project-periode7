import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import friendsData from '../../../assets/friends.json'; // Zorg dat dit klopt

const GroupDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [group, setGroup] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [tags, setTags] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [friends, setFriends] = useState(friendsData);

  useEffect(() => {
    const loadGroup = async () => {
      const storedGroups = await AsyncStorage.getItem('groups');
      const groups = storedGroups ? JSON.parse(storedGroups) : [];
      const foundGroup = groups.find(g => g.id === id);

      if (foundGroup) {
        setGroup(foundGroup);
        setGroupName(foundGroup.name);
        setTags(foundGroup.tags.join(', '));
        setSelectedMembers(foundGroup.members || []);
      }
    };

    loadGroup();
  }, [id]);

  const saveChanges = async () => {
    const updatedGroup = {
      ...group,
      name: groupName,
      tags: tags.split(',').map(tag => tag.trim()),
      members: selectedMembers,
    };

    const storedGroups = await AsyncStorage.getItem('groups');
    const groups = storedGroups ? JSON.parse(storedGroups) : [];
    const updatedGroups = groups.map(g => g.id === id ? updatedGroup : g);
    await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
    Alert.alert('Succes', 'Groep is bijgewerkt');
    router.push('../tabs/groups'); // <-- laat overzichtspagina opnieuw laden
  };

  const toggleMember = (name) => {
    if (selectedMembers.includes(name)) {
      setSelectedMembers(selectedMembers.filter(member => member !== name));
    } else {
      setSelectedMembers([...selectedMembers, name]);
    }
  };

  if (!group) return <Text style={{ padding: 20 }}>Laden...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bewerk Groep</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Naam</Text>
      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Groepsnaam"
      />

      <Text style={styles.label}>Tags</Text>
      <TextInput
        style={styles.input}
        value={tags}
        onChangeText={setTags}
        placeholder="Tags (komma gescheiden)"
      />

      <Text style={styles.label}>Leden</Text>
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

      <TouchableOpacity style={styles.button} onPress={saveChanges}>
        <Text style={styles.buttonText}>Opslaan</Text>
      </TouchableOpacity>
      
        <TouchableOpacity
        style={[styles.button, { backgroundColor: '#ffa500', marginTop: 10 }]}
        onPress={async () => {
            const storedGroups = await AsyncStorage.getItem('groups');
            const groups = storedGroups ? JSON.parse(storedGroups) : [];
            const updatedGroups = groups.filter(g => g.id !== id); // zelfde gedrag voorlopig
            await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
            router.push('../tabs/groups');
        }}
        >
        <Text style={styles.buttonText}>Verlaat groep</Text>
        </TouchableOpacity>
            <TouchableOpacity
        style={[styles.button, { backgroundColor: '#ff4d4d' }]}
        onPress={async () => {
            const storedGroups = await AsyncStorage.getItem('groups');
            const groups = storedGroups ? JSON.parse(storedGroups) : [];
            const updatedGroups = groups.filter(g => g.id !== id);
            await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
            router.push('../tabs/groups');
        }}
        >
        <Text style={styles.buttonText}>Verwijder groep</Text>
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

export default GroupDetailScreen;
