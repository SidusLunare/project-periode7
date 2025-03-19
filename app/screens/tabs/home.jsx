import { StyleSheet, Text, View, FlatList } from 'react-native'

const DATA = [
  {
    id: 1,
    title: "Barcelona",
  },
  {
    id: 2,
    title: "Pyongyang"
  },
  {
    id: 3,
    title: "Sichuan"
  }
]

export default function Home() {
  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          <View>
            <Text>{item.title}</Text>
          </View>
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 10,
    backgroundColor: "#f8f8f8",
  }
})