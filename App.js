import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Styles } from "./style/Styles";
import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import moment from "moment";
import { Linking } from "react-native";
import { Card, Button } from "react-native-elements";
import { Icon } from "react-native-elements";

const API_KEY = "34fef9bfa512481681f9a6897ec764b3";

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
  const [hasErrored, setHasApiError] = useState(false);
  const [lastPageReached, setLastPageReached] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const data = useMemo(() => articles, [articles]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPageNumber(1);
    setLastPageReached(false);
    getNews();
    setRefreshing(false);
  }, [refreshing]);

  const onPress = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log(`Don't know how to open url: ${url}`);
      }
    });
  };

  const getNews = async () => {
    if (lastPageReached) return;
    setLoading(true);
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}&page=${pageNumber}`;
      const response = await fetch(url);
      const jsonData = await response.json();
      const hasMoreArticles = jsonData.articles.length > 0;
      if (hasMoreArticles) {
        const newArticleList = filterForUniqueArticles(
          articles.concat(jsonData.articles)
        );
        setArticles(newArticleList.filter((item) => item.urlToImage !== null));
        setPageNumber(pageNumber + 1);
      } else {
        setLastPageReached(true);
      }
    } catch (error) {
      setHasApiError(true);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => {
    return (
      <Card title={item.title} image={{ uri: item.urlToImage }}>
        <View style={Styles.row}>
          <Text style={Styles.label}>Source</Text>
          <Text style={Styles.info}>{item.source.name}</Text>
        </View>
        <Text style={{ marginBottom: 10 }}>{item.content}</Text>
        <View style={Styles.row}>
          <Text style={Styles.label}> Published</Text>
          <Text style={Styles.info}>
            {moment(item.publishedAt).format("LLL")}
          </Text>
        </View>
        <Button
          icon={<Icon />}
          title="Read more"
          backgroundColor="#03A9F4"
          onPress={() => onPress(item.url)}
        />
      </Card>
    );
  };

  useEffect(() => {
    getNews();
  }, [articles, refreshing]);

  if (loading && !refreshing)
    return (
      <View style={Styles.container}>
        <ActivityIndicator size="large" loading={loading} />
      </View>
    );
  if (hasErrored)
    return (
      <View style={Styles.container}>
        <Text>Error!</Text>
      </View>
    );

  return (
    <View style={Styles.container}>
      <View style={Styles.row}>
        <Text style={Styles.label}>Articles Count:</Text>
        <Text style={Styles.info}>{articles.length}</Text>
      </View>
      <FlatList
        data={data}
        onEndReached={getNews}
        onEndReachedThreshold={1}
        keyExtractor={(data) => data.title}
        renderItem={renderItem}
        ListFooterComponent={
          lastPageReached ? (
            <Text>No more articles</Text>
          ) : (
            <ActivityIndicator size="large" loading={loading} />
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
