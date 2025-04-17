import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

// Utility functions
const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jessie', 'Jamie', 'Cameron'];
const groupNames = ['Travel Buddies', 'Foodies', 'Gamers United'];

function getRandomName() {
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomAvatarUrl() {
  // pravatar offers placeholder avatars
  const id = Math.floor(Math.random() * 70) + 1;
  return `https://i.pravatar.cc/150?img=${id}`;
}

export default function NotificationsScreen() {
  // Generate sample notifications with random names and avatars
  const notifications = useMemo(() => [
    {
      id: '1',
      type: 'invite',
      title: "You've been invited to join a group!",
      inviter: getRandomName(),
      group: groupNames[Math.floor(Math.random() * groupNames.length)],
      avatar: { uri: getRandomAvatarUrl() },
    },
    ...Array.from({ length: 4 }).map((_, idx) => ({
      id: `${2 + idx}`,
      type: 'post',
      user: getRandomName(),
      avatar: { uri: getRandomAvatarUrl() },
      message: 'Here is a placeholder message for your notification.',
    })),
    {
      id: '6',
      type: 'trip',
      user: getRandomName(),
      avatar: { uri: getRandomAvatarUrl() },
      title: 'posted a trip!',
      image: require('../../../server/images/tokyo.png'),
    },
  ], []);

  const renderItem = ({ item }) => {
    if (item.type === 'invite') {
      return (
        <View style={styles.card}>
          <View style={styles.row}>
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{`${item.inviter} has invited you to join ${item.group}.`}</Text>
            </View>
          </View>
          <View style={[styles.row, styles.actions]}>  
            <TouchableOpacity style={[styles.button, styles.accept]}>  
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.decline]}>  
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (item.type === 'post') {
      return (
        <View style={styles.cardSmall}>
          <Image source={item.avatar} style={styles.avatarSmall} />
          <View style={styles.textContainer}>  
            <Text style={styles.bold}>{item.user} posted:</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        </View>
      );
    }

    if (item.type === 'trip') {
      return (
        <View style={styles.card}>
          <View style={styles.row}>
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.bold}>{item.user} {item.title}</Text>
            </View>
          </View>
          <Image source={item.image} style={styles.tripImage} />
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  listContainer: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  cardSmall: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarSmall: { width: 40, height: 40, borderRadius: 20 },
  textContainer: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#555', marginTop: 4 },
  bold: { fontWeight: 'bold', fontSize: 14 },
  message: { fontSize: 14, color: '#333', marginTop: 4 },
  actions: { marginTop: 12, justifyContent: 'space-between', flexDirection: 'row' },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  accept: { backgroundColor: '#4CAF50' },
  decline: { backgroundColor: '#F44336' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  tripImage: { width: '100%', height: 180, marginTop: 12, borderRadius: 12 },
});
