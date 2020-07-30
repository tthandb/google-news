import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import moment from "moment";
import { Card, Button } from "react-native-elements";
import { Icon } from "react-native-elements";
const filterForUniqueArticles = (arr) => {
  const cleaned = [];
  arr.forEach((itm) => {
    let unique = true;
    cleaned.forEach((itm2) => {
      const isEqual = JSON.stringify(itm) === JSON.stringify(itm2);
      if (isEqual) unique = false;
    });
    if (unique) cleaned.push(itm);
  });
  return cleaned;
};
export default function App() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const getNews = async () => {
    const response = await fetch(
      "https://newsapi.org/v2/top-headlines?country=us&apiKey=34fef9bfa512481681f9a6897ec764b3"
    );
    const jsonData = await response.json();
    /* setArticles(
      jsonData.articles.filter((article) => article.urlToImage !== null)
    );*/
    const newArticleList = filterForUniqueArticles(
      articles.concat(jsonData.articles)
    );
    setArticles(newArticleList.filter((article)=>article.urlToImage!==null));
    setPageNumber(pageNumber + 1);
    setLoading(false);
  };

  const renderItem = ({ item }) => {
    const article = item;
    return (
      <Card title={article.title} image={{ uri: article.urlToImage }}>
        <View style={styles.row}>
          <Text style={styles.label}>Source</Text>
          <Text style={styles.info}>{article.source.name}</Text>
        </View>
        <Text style={{ marginBottom: 10 }}>{article.content}</Text>
        <View style={styles.row}>
          <Text style={styles.label}> Published</Text>
          <Text style={styles.info}>
            {moment(article.publishedAt).format("LLL")}
          </Text>
        </View>
        <Button icon={<Icon />} title="Read more" backgroundColor="#03A9F4" />
      </Card>
    );
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
      <View style={styles.row}>
        <Text style={styles.label}>Articles Count:</Text>
        <Text style={styles.info}>{articles.length}</Text>
      </View>
      <FlatList
        data={articles}
        onEndReached={getNews}
        onEndReachedThreshold={1}
        keyExtractor={(data, index) => {
          console.log(index);
          return index.toString();
        }}
        renderItem={renderItem}
      />
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
