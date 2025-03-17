import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'

export default function Home() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <Text>My Trips</Text>
      <Image style={styles.thumbnail} source={require('../../../assets/images/barcelona.png')} />
      <Image style={styles.thumbnail} source={require('../../../assets/images/newyork.png')} />
      <Image style={styles.thumbnail} source={require('../../../assets/images/barcelona.png')} />
      <Image style={styles.thumbnail} source={require('../../../assets/images/barcelona.png')} />
      <Image style={styles.thumbnail} source={require('../../../assets/images/barcelona.png')} />
      </ScrollView>
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
    resizeMode: 'cover'
  }
  
})