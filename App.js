import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import moment from "moment";
import { Card, Button } from "react-native-elements";
import { Icon } from "react-native-elements";
export default function App() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const getNews = async () => {
    const response = await fetch(
      "https://newsapi.org/v2/top-headlines?country=us&apiKey=34fef9bfa512481681f9a6897ec764b3"
    );
    const jsonData = await response.json();
    setArticles(jsonData.articles);
    setLoading(false);
  };
  useEffect(() => {
    getNews();
  }, []);
  if (loading)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" loading={loading} />
      </View>
    );
  return (
    <View style={styles.container}>
      <Card title={articles[0].title} image={{ uri: articles[0].urlToImage }} />
    </View>
  );
}

const styles = StyleSheet.create({
  containerFlex: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    height: 30,
    width: "100%",
    backgroundColor: "pink",
  },
  row: {
    flexDirection: "row",
  },
  label: {
    fontSize: 16,
    color: "black",
    marginRight: 10,
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
    color: "grey",
  },
});
