import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StocksScreen({ route }) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState({
    /* FixMe: initial state here */
  });

  // can put more code here

  useEffect(() => {
    // FixMe: fetch stock data from the server for any new symbols added to the watchlist and save in local StocksScreen state
  }, [watchList]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {watchList.myList.map((x) => (
          <MyList data={x} />
        ))}
      </ScrollView>
      <StockDetail />
    </View>
  );
}

function MyList(props) {
  return (
    <View>
      <Text style={styles.symbol}>{props.data}</Text>
    </View>
  );
}

function StockDetail(props) {
  return (
    <View style={styles.stockDetailContainer}>
      <Text style={styles.stockDetailTitle}>Stock detail</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: "100%" },
  symbol: {
    color: "white",
    fontSize: 20,
    paddingVertical: scaleSize(5),
  },
  stockDetailContainer: {
    borderTopColor: "white",
    borderTopWidth: 1,
    height: "30%",
  },
  stockDetailTitle: {
    color: "white",
    textAlign: "center",
    paddingVertical: scaleSize(5),
    fontWeight: "bold",
  },
});
