import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import data from '../data';

export default function TripScreen() {
  const { id } = useLocalSearchParams();

  const trip = data.find((item) => item.id === parseInt(id));

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
       
        <Text style={styles.text}>{trip.city}</Text>

        {trip ? (
          <Image style={styles.thumbnail} source={trip.img} />
        ) : (
          <Text>Trip not found</Text>
        )}

      <Text>{trip.day_1}</Text>
      <Text>{trip.day_2}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    padding: 10,
  },
  thumbnail: {
    width: 410,
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
    margin: 5,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
