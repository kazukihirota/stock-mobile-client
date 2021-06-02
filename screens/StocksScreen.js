import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";

//to swipe the element in the watch list
import Swipeable from "react-native-gesture-handler/Swipeable";
import { FlatList } from "react-native";

export default function StocksScreen() {
  const { watchList, deleteItem } = useStocksContext();
  const renderRef = useRef(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stockDetail, setStockDetail] = useState("");

  const [state, setState] = useState([]);

  //fetching data from the server
  let retrieveStockDatafromServer = async () => {
    setError(null);
    // console.log("watchList:", watchList);
    const symbolsExist = state.map((obj) => obj.symbol);
    console.log("symbols in state", symbolsExist);
    const symbolsToFetch = watchList.filter(
      (obj) => symbolsExist.indexOf(obj) == -1
    );
    try {
      let data = await fetchData(symbolsToFetch);
      console.log(
        "fetched data",
        data.map((obj) => obj.symbol)
      );
      setState((oldArray) => {
        return [...oldArray, ...data];
      });
      setIsLoaded(true);
    } catch (error) {
      setError(error);
      setIsLoaded(true);
    }
  };

  const handleDelete = (symbol) => {
    const newState = state.filter((item) => item.symbol !== symbol);
    console.log(
      "newState",
      newState.map((obj) => obj.symbol)
    );
    deleteItem(symbol);
    setState(newState);
  };
  useEffect(() => {
    console.log(
      "state: ",
      state.map((obj) => obj.symbol)
    );
  }, [state]);

  useEffect(() => {
    if (renderRef.current) {
      //preventing initial rendering
      retrieveStockDatafromServer();
    } else {
      renderRef.current = true;
    }
  }, [watchList]);

  if (error) {
    return (
      <View>
        <Text style={{ color: "white", textAlign: "center" }}>
          Error: {error.message}
        </Text>
        <TouchableOpacity onPress={() => clearAsync()}>
          <Text style={{ color: "white", textAlign: "center" }}>
            Clear storage
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else if (watchList.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            color: "white",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          No data to display
        </Text>
      </View>
    );
  } else if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ color: "white", textAlign: "center" }}>Loading...</Text>
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={state}
          keyExtractor={(item) => item.symbol}
          renderItem={({ item, index }) => {
            return (
              <MyList
                symbol={item.symbol}
                price={Math.round(item.data[0].close * 100) / 100}
                percent={Math.round(item.data[0].changePercent * 100) / 100}
                viewStockDetail={() =>
                  stockDetail === ""
                    ? setStockDetail(item.symbol)
                    : setStockDetail("")
                }
                handleDelete={() => handleDelete(item.symbol)}
              />
            );
          }}
        />

        <TouchableOpacity onPress={() => clearAsync()}>
          <Text style={{ color: "white", textAlign: "center" }}>
            Clear storage
          </Text>
        </TouchableOpacity>
        {stockDetail !== "" && (
          <StockDetail
            symbol={stockDetail}
            data={state.filter((obj) => {
              return obj.symbol === stockDetail;
            })}
            setStockDetail={setStockDetail}
          />
        )}
      </SafeAreaView>
    );
  }
}

async function fetchData(symbols) {
  const results = [];
  try {
    for (let symbol of symbols) {
      let url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=a061788633309dc50960045d59051a3a`;
      let res = await fetch(url);
      let data = await res.json();
      let historical = data.historical.slice(0, 99);
      let result = historical.map((obj) => {
        return {
          date: obj.date,
          open: obj.open,
          high: obj.high,
          low: obj.low,
          close: obj.close,
          volume: obj.volume,
          changePercent: obj.changePercent,
        };
      });
      results.push({ symbol: symbol, data: result });
    }
    return results;
    // for (let symbol of symbols) {
    //   let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=0EK7KVFSFJRXJO0Z`;

    //   let res = await fetch(url);
    //   let data = await res.json();
    //   let dailyData = data["Time Series (Daily)"];
    //   let dailyDataArray = Object.entries(dailyData).map((e) => ({
    //     [e[0]]: e[1],
    //   }));
    //   const result = dailyDataArray.map((data) => {
    //     return {
    //       date: Object.keys(data).toString(),
    //       open: Object.values(data)[0]["1. open"],
    //       high: Object.values(data)[0]["2. high"],
    //       low: Object.values(data)[0]["3. low"],
    //       close: Object.values(data)[0]["4. close"],
    //       volumes: Object.values(data)[0]["5. volume"],
    //     };
    //   });
    //   console.log("fetched ", symbol);
    //   results.push({ symbol: symbol, data: result });
    //   console.log(
    //     "results array",
    //     results.map((obj) => obj.symbol)
    //   );
    // }
  } catch (err) {
    console.log(err);
    return results;
  }
}

function MyList(props) {
  //function for the deletion of stock from watch List
  const rightSwipe = () => {
    return (
      <TouchableOpacity
        style={styles.deleteBox}
        onPress={() => props.handleDelete()}
      >
        <View style={styles.deleteBox}>
          <AntDesign name="delete" size={24} color="white" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={rightSwipe}>
      <TouchableOpacity
        style={styles.stockContainer}
        onPress={() => props.viewStockDetail()}
      >
        <Text style={styles.symbol}>{props.symbol}</Text>
        <Text style={styles.price}>{props.price}</Text>
        <View
          style={
            props.percent > 0 ? styles.percentBoxGreen : styles.percentBoxRed
          }
        >
          <Text style={styles.percent}>{props.percent} %</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

//Stock Detail component appears when user select a stock
function StockDetail(props) {
  const dates = props.data[0].data.map((item) => item.date).reverse();
  const datesNew = dates.filter(function (value, index) {
    return index % 20 == 0;
  });
  const closePrices = props.data[0].data.map((item) => item.close).reverse();
  const dataForGraph = {
    labels: datesNew,
    datasets: [
      {
        data: closePrices,
      },
    ],
  };
  return (
    <View style={styles.stockDetailContainer}>
      <View style={styles.stockDetailHeader}>
        <Text style={styles.stockDetailHeaderText}>Stock detail</Text>
        <TouchableOpacity
          style={styles.hideButton}
          onPress={() => props.setStockDetail("")}
        >
          <AntDesign name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.stockDetailTitle}>{props.symbol}</Text>
      <View style={styles.stockDetailRow}>
        <Text style={styles.stockDetailText}>
          Open: {Math.round(props.data[0].data[0].open * 100) / 100}
        </Text>
        <Text style={styles.stockDetailText}>
          Close: {Math.round(props.data[0].data[0].close * 100) / 100}
        </Text>
      </View>
      <View style={styles.stockDetailRow}>
        <Text style={styles.stockDetailText}>
          High:{Math.round(props.data[0].data[0].high * 100) / 100}
        </Text>
        <Text style={styles.stockDetailText}>
          Low: {Math.round(props.data[0].data[0].low * 100) / 100}
        </Text>
      </View>
      <View style={styles.stockDetailRow}>
        <Text style={styles.stockDetailText}>
          Volume: {props.data[0].data[0].volume}
        </Text>
      </View>

      <View>
        <LineChart
          data={dataForGraph}
          width={Dimensions.get("window").width}
          height={220}
          style={{
            marginVertical: scaleSize(5),
            borderRadius: 16,
          }}
          yAxisInterval={10}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "2",
              strokeWidth: "1",
              stroke: "#ffa726",
            },
          }}
        />
      </View>
    </View>
  );
}

//clear async storage for development purpose
let clearAsync = async () => {
  AsyncStorage.clear();
  console.log("cleared async storage");
};

const styles = StyleSheet.create({
  container: { height: "100%" },
  stockContainer: {
    flexDirection: "row",
    borderBottomColor: "white",
    borderBottomWidth: 0.2,
    paddingVertical: scaleSize(10),
    backgroundColor: "#343634",
  },
  symbol: {
    color: "white",
    flex: 2,
    fontSize: scaleSize(22),
    fontWeight: "bold",
    paddingVertical: scaleSize(5),
    marginLeft: scaleSize(20),
  },
  price: {
    flex: 1,
    color: "white",
    fontSize: scaleSize(22),
    paddingVertical: scaleSize(5),
  },
  percent: {
    flex: 1,
    color: "white",
    fontSize: scaleSize(20),
    textAlign: "center",
    paddingVertical: scaleSize(3),
  },
  percentBoxRed: {
    backgroundColor: "red",
    borderRadius: 5,
    marginRight: scaleSize(20),
    padding: scaleSize(3),
  },
  percentBoxGreen: {
    backgroundColor: "#19e37b",
    borderRadius: 5,
    marginRight: scaleSize(20),
    padding: scaleSize(3),
  },
  deleteBox: {
    backgroundColor: "red",
    color: "white",
    justifyContent: "center",
    padding: scaleSize(5),
  },
  deleteBoxText: {
    color: "white",
  },

  stockDetailContainer: {
    borderTopColor: "white",
    borderTopWidth: scaleSize(1),
    height: "60%",
    backgroundColor: "#343634",
  },
  stockDetailHeader: {
    borderBottomColor: "white",
    borderBottomWidth: scaleSize(1),
    paddingVertical: scaleSize(5),
    flexDirection: "row",
  },
  stockDetailHeaderText: {
    color: "white",
    textAlign: "center",
    flex: 8,
    alignItems: "center",
    fontWeight: "bold",
    fontSize: scaleSize(20),
    left: "50%",
  },
  hideButton: {
    flex: 1,
    alignItems: "flex-end",
  },
  stockDetailTitle: {
    color: "white",
    textAlign: "center",
    paddingVertical: scaleSize(10),
    fontWeight: "bold",
    fontSize: scaleSize(30),
  },
  stockDetailRow: {
    flexDirection: "row",
    paddingLeft: scaleSize(20),
    borderTopColor: "white",
    borderTopWidth: scaleSize(1),
  },
  stockDetailText: {
    flex: 1,
    color: "white",
    fontSize: scaleSize(15),
    paddingVertical: scaleSize(6),
  },
});
