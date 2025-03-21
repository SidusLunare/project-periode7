import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import data from '../../data';

const Details = ({ title }) => {
  const router = useRouter();

  //Tripscreen
  const navigateToTripScreen = (id, city) => {
    router.push(`/screens/tripscreen?id=${id}&name=${city}`);
  };


  //Homepage
  return (
      <ScrollView style={styles.scrollView}>
        <Text style={styles.text}>🏖️ My Trips</Text>

        {data.map((trip, index) => (
          <View key={index}>
            <Pressable onPress={() => navigateToTripScreen(trip.id, trip.name)}>
              <Image style={styles.thumbnail} source={trip.img} />
            </Pressable>
            <Text style={styles.date}>{trip.date}</Text>
          </View>
        ))}
      </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    
      date: {
        marginLeft: 5,
        color: 'grey',
        marginBottom: 15,
        fontSize: 12,
      },
      
})

export default Details;