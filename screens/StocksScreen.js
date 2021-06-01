import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";

//to swipe the element in the watch list
import Swipeable from "react-native-gesture-handler/Swipeable";

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
    console.log("Symbols to fetch", symbolsToFetch);
    try {
      console.log("trying to fetch...");
      let data = await fetchData(symbolsToFetch);
      console.log(
        "fetched data",
        data.map((obj) => obj.symbol)
      );
      setState((oldArray) => {
        //removing duplicate data
        // const filteredData = data.filter(
        //   (obj) => symbolsExist.indexOf(obj.symbol) == -1
        // );
        // console.log("old array", oldArray);
        return [...oldArray, ...data];
      });
      setIsLoaded(true);
    } catch (error) {
      setError(error);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (renderRef.current) {
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
  } else if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ color: "white", textAlign: "center" }}>Loading...</Text>
      </View>
    );
  } else if (watchList.length === 0) {
    return (
      <View>
        <Text style={{ color: "white", textAlign: "center" }}>
          No data to display
        </Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ScrollView>
          {watchList !== [] &&
            state.map((x) => (
              <MyList
                symbol={x.symbol}
                key={x.symbol}
                price={Math.round(x.data[0].close * 100) / 100}
                percent={
                  Math.round((x.data[0].close / x.data[0].open) * 100) / 100
                }
                viewStockDetail={() =>
                  stockDetail === ""
                    ? setStockDetail(x.symbol)
                    : setStockDetail("")
                }
                handleDelete={() => deleteItem(x.symbol)}
              />
            ))}
        </ScrollView>
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
      </View>
    );
  }
}

async function fetchData(symbols) {
  // let promises = [];
  // console.log("fetching company stock detail on stock screen");
  // for (let symbol of symbols) {
  //   promises.push(
  //     fetch(
  //       `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=0EK7KVFSFJRXJO0Z`
  //     )
  //   );
  // }

  // Promise.all(promises).then((res) => console.log(res));
  // .then((data) => data["Time Series (Daily)"])
  // .then((dailyData) =>
  //   Object.entries(dailyData).map((e) => ({
  //     [e[0]]: e[1],
  //   }))
  // )
  // .then((dailyDataArray) =>
  //   dailyDataArray.map((data) => {
  //     return {
  //       date: Object.keys(data).toString(),
  //       open: Object.values(data)[0]["1. open"],
  //       high: Object.values(data)[0]["2. high"],
  //       low: Object.values(data)[0]["3. low"],
  //       close: Object.values(data)[0]["4. close"],
  //       volumes: Object.values(data)[0]["5. volume"],
  //     };
  //   })
  // )
  // .then((history) => {
  //   results.push({ symbol: symbol, data: history });
  //   console.log("fetched ", symbol);
  // });
  // for (let symbol of symbols) {
  //   let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=0EK7KVFSFJRXJO0Z`;

  //   fetch(url)
  //     .then((res) => res.json())
  //     .then((data) => data["Time Series (Daily)"])
  //     .then((dailyData) =>
  //       Object.entries(dailyData).map((e) => ({
  //         [e[0]]: e[1],
  //       }))
  //     )
  //     .then((dailyDataArray) =>
  //       dailyDataArray.map((data) => {
  //         return {
  //           date: Object.keys(data).toString(),
  //           open: Object.values(data)[0]["1. open"],
  //           high: Object.values(data)[0]["2. high"],
  //           low: Object.values(data)[0]["3. low"],
  //           close: Object.values(data)[0]["4. close"],
  //           volumes: Object.values(data)[0]["5. volume"],
  //         };
  //       })
  //     )
  //     .then((history) => {
  //       results.push({ symbol: symbol, data: history });
  //       console.log("fetched ", symbol);
  //     });

  const results = [];
  try {
    for (let symbol of symbols) {
      let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=0EK7KVFSFJRXJO0Z`;

      let res = await fetch(url);
      let data = await res.json();
      let dailyData = data["Time Series (Daily)"];
      let dailyDataArray = Object.entries(dailyData).map((e) => ({
        [e[0]]: e[1],
      }));
      const result = dailyDataArray.map((data) => {
        return {
          date: Object.keys(data).toString(),
          open: Object.values(data)[0]["1. open"],
          high: Object.values(data)[0]["2. high"],
          low: Object.values(data)[0]["3. low"],
          close: Object.values(data)[0]["4. close"],
          volumes: Object.values(data)[0]["5. volume"],
        };
      });
      console.log("fetched ", symbol);
      results.push({ symbol: symbol, data: result });
      console.log(
        "results array",
        results.map((obj) => obj.symbol)
      );
    }

    console.log(
      "results array",
      results.map((obj) => obj.symbol)
    );
    return results;
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
          <Text style={styles.deleteBoxText}>Delete</Text>
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
        <View style={styles.percentBox}>
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
          <AntDesign name="close" size={24} color="black" />
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
          Volume: {props.data[0].data[0].volumes}
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
  percentBox: {
    backgroundColor: "red",
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
