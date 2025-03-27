import { StyleSheet, Text, View, Image, ScrollView, Pressable, FlatList } from 'react-native'
import data from '../../data'
import Details from '../components/Details';

export default function Home() {
  return (
    <View style={styles.container}>

      <FlatList 
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Details title={item.title}></Details>
        )}
      />
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
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

  date: {
    marginLeft: 5,
    color: 'grey',
    marginBottom: 15,
    fontSize: 12,
  },
  
})