import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from "react-i18next";

const chat = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <Text>{t("chat") || "Chat"}</Text>
    </SafeAreaView>
  )
}

export default chat

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