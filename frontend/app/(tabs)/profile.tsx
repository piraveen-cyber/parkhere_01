import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text >profile</Text>
    </SafeAreaView>
  )
}

export default profile

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingTop: 20,
    justifyContent: "center",
    alignItems: "center",
  }
})