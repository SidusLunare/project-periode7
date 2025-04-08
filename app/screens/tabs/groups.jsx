import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupOverview = () => {
  const [groups, setGroups] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [updatedGroupName, setUpdatedGroupName] = useState('');
  const [updatedTags, setUpdatedTags] = useState('');
  const [newMember, setNewMember] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const storedGroups = await AsyncStorage.getItem('groups');
        if (storedGroups) {
          const parsedGroups = JSON.parse(storedGroups);
          setGroups(parsedGroups);
        }
      } catch (error) {
        console.error('Error loading groups from storage', error);
      }
    };

    loadGroups();
  }, []);

  const deleteGroup = async (groupId) => {
    try {
      const storedGroups = await AsyncStorage.getItem('groups');
      if (storedGroups) {
        const groups = JSON.parse(storedGroups);
        const filteredGroups = groups.filter(group => group.id !== groupId);
        await AsyncStorage.setItem('groups', JSON.stringify(filteredGroups));
        setGroups(filteredGroups);
      }
    } catch (error) {
      console.error('Error deleting group', error);
    }
  };

  const confirmDelete = (groupId) => {
    Alert.alert(
      "Bevestig Verwijdering",
      "Weet je zeker dat je deze groep wilt verwijderen?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Verwijder",
          onPress: () => deleteGroup(groupId),
          style: "destructive"
        }
      ]
    );
  };

  const toggleGroupDetails = (groupId) => {
    setExpandedGroup(prevGroupId => prevGroupId === groupId ? null : groupId);
    if (expandedGroup !== groupId) {
      const group = groups.find(g => g.id === groupId);
      setSelectedGroup(group);
      setUpdatedGroupName(group.name);
      setUpdatedTags(group.tags.join(', '));
      setNewMember('');
    }
  };

  const updateGroupName = async (groupId) => {
    if (updatedGroupName.trim() === '') return;

    const updatedGroups = groups.map(group =>
      group.id === groupId ? { ...group, name: updatedGroupName } : group
    );

    setGroups(updatedGroups);
    await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
    setExpandedGroup(null);
  };

  const updateTags = async (groupId) => {
    const tagsArray = updatedTags.split(',').map(tag => tag.trim());

    const updatedGroups = groups.map(group =>
      group.id === groupId ? { ...group, tags: tagsArray } : group
    );

    setGroups(updatedGroups);
    await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
    setExpandedGroup(null);
  };

  const addMember = async (groupId) => {
    if (!newMember.trim()) return;

    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        return { ...group, members: [...group.members, newMember.trim()] };
      }
      return group;
    });

    setGroups(updatedGroups);
    await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
    setNewMember('');
  };

  const removeMember = async (groupId, member) => {
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        return { ...group, members: group.members.filter(m => m !== member) };
      }
      return group;
    });

    setGroups(updatedGroups);
    await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`../detail/${item.id}`)}>
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupTags}>Tags: {item.tags.join(', ')}</Text>
      <Text style={styles.groupMembers}>Leden: {item.members.join(', ')}</Text>
  
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => confirmDelete(item.id)}
        >
          <Ionicons name="trash-bin" size={24} color="red" />
        </TouchableOpacity>
      </View>
  
      {expandedGroup === item.id && (
        <View style={styles.expandedSection}>
          <TextInput
            style={styles.input}
            value={updatedGroupName}
            onChangeText={setUpdatedGroupName}
            placeholder="Bewerk naam"
          />
          <Button title="Update Naam" onPress={() => updateGroupName(item.id)} />
  
          <TextInput
            style={styles.input}
            value={updatedTags}
            onChangeText={setUpdatedTags}
            placeholder="Bewerk tags (scheid met komma's)"
          />
          <Button title="Update Tags" onPress={() => updateTags(item.id)} />
  
          <TextInput
            style={styles.input}
            value={newMember}
            onChangeText={setNewMember}
            placeholder="Voeg lid toe"
          />
          <Button title="Voeg Lid Toe" onPress={() => addMember(item.id)} />
  
          <View>
            <Text style={styles.label}>Leden:</Text>
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
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jouw Groepen</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => router.push('../detail/CreateGroup')}>
        <Ionicons name="add-circle" size={40} color="#000" />
      </TouchableOpacity>

      {groups.length === 0 ? (
        <Text style={styles.emptyMessage}>Je hebt nog geen groepen. Maak er een, of vraag iemand je uit te nodigen!</Text>
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
  },
  groupTags: {
    marginTop: 5,
    color: '#666',
  },
  groupMembers: {
    marginTop: 5,
    color: '#444',
  },
  addButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    marginLeft: 15,
    padding: 5,
  },
  expandedSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#e0e0e0',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    alignItems: 'center',
  },
  memberName: {
    fontSize: 16,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
    marginTop: 30,
  },
});

export default GroupOverview;
