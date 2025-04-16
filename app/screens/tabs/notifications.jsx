import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const formatDate = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  };

  const addNotification = () => {
    if (text.trim() || image) {
      const newNotification = {
        id: Date.now().toString(),
        message: text,
        image,
        time: formatDate(),
      };

      setNotifications((prev) => [newNotification, ...prev]);

      setText('');
      setImage(null);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => {
      const removed = prev.find((item) => item.id === id);
      if (removed) setHistory((hist) => [...hist, removed]);
      return prev.filter((item) => item.id !== id);
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const displayedNotifications = showHistory ? history : notifications;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {showHistory ? 'Notificatiegeschiedenis' : 'Recente Notificaties'}
        </Text>
        <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
          <Ionicons name={showHistory ? 'close' : 'time-outline'} size={24} color="black" />
        </TouchableOpacity>
      </View>

      {notifications.length === 0 && !showHistory && (
        <Text style={styles.emptyMessage}>Je bent helemaal bij!</Text>
      )}

      <FlatList
        data={displayedNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.notificationImage} />
            )}
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{item.message}</Text>
              <Text style={styles.timestamp}>{item.time}</Text>
            </View>
            {!showHistory && (
              <TouchableOpacity onPress={() => removeNotification(item.id)}>
                <Ionicons name="close" size={20} color="red" />
              </TouchableOpacity>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 200 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Voer notificatie in"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text>Afbeelding kiezen</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        <TouchableOpacity style={styles.sendButton} onPress={addNotification}>
          <Text style={styles.sendButtonText}>Notificatie verzenden</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  emptyMessage: { textAlign: 'center', marginTop: 20, color: 'gray' },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  notificationImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  messageContainer: { flex: 1 },
  messageText: { fontSize: 16 },
  timestamp: { fontSize: 12, color: 'gray', alignSelf: 'flex-end' },
  inputContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePicker: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  sendButtonText: { color: 'white', fontWeight: 'bold' },
});
