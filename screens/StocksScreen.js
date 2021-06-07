import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";
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
    const symbolsToFetch = watchList.filter(
      (obj) => symbolsExist.indexOf(obj) == -1
    );
    try {
      let data = await fetchData(symbolsToFetch);
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
    deleteItem(symbol);
    setState(newState);
  };

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

//function to fetch data from the server
async function fetchData(symbols) {
  const results = [];
  try {
    for (let symbol of symbols) {
      let url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=a061788633309dc50960045d59051a3a`;
      let res = await fetch(url);
      let data = await res.json();
      let historical = data.historical.slice(0, 179);
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
  //days for data to display
  const [days, setDays] = useState(180);

  const dates = props.data[0].data
    .map((item) => item.date)
    .slice(0, days - 1)
    .reverse();

  const datesNew = dates.filter(function (value, index) {
    switch (days) {
      case 7:
        return index;

      case 30:
        return index % 6 === 0;

      case 90:
        return index % 18 === 0;

      case 180:
        return index % 36 === 0;
    }
  });
  const closePrices = props.data[0].data
    .map((item) => item.close)
    .slice(0, days - 1)
    .reverse();

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
        <Text style={styles.stockDetailHeaderText}>{props.symbol}</Text>
        <TouchableOpacity
          style={styles.hideButton}
          onPress={() => props.setStockDetail("")}
        >
          <AntDesign name="closecircle" size={24} color="grey" />
        </TouchableOpacity>
      </View>

      <View style={styles.DaysRow}>
        <TouchableOpacity
          style={days === 7 ? styles.selectedDayButton : styles.DayButton}
          onPress={() => setDays(7)}
        >
          <Text style={days === 7 ? styles.selectedDayText : styles.DayText}>
            1W
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={days === 30 ? styles.selectedDayButton : styles.DayButton}
          onPress={() => setDays(30)}
        >
          <Text style={days === 30 ? styles.selectedDayText : styles.DayText}>
            1M
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={days === 90 ? styles.selectedDayButton : styles.DayButton}
          onPress={() => setDays(90)}
        >
          <Text style={days === 90 ? styles.selectedDayText : styles.DayText}>
            3M
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={days === 180 ? styles.selectedDayButton : styles.DayButton}
          onPress={() => setDays(180)}
        >
          <Text style={days === 180 ? styles.selectedDayText : styles.DayText}>
            6M
          </Text>
        </TouchableOpacity>
      </View>

      <LineChart
        data={dataForGraph}
        width={Dimensions.get("window").width}
        height={scaleSize(200)}
        style={{
          marginTop: scaleSize(8),
          borderRadius: 5,
        }}
        yAxisInterval={10}
        chartConfig={{
          backgroundColor: "#222324",
          fillShadowGradient: "#2cc97b",
          fillShadowGradientOpacity: 0.5,
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          strokeWidth: "3",
          propsForDots: {
            r: "1",
            strokeWidth: "1",
            stroke: "#21bf70",
          },
        }}
      />

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
          High: {Math.round(props.data[0].data[0].high * 100) / 100}
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
    </View>
  );
}

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
    backgroundColor: "#222324",
  },
  stockDetailHeader: {
    borderTopColor: "white",
    borderTopWidth: scaleSize(1),
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
    fontSize: scaleSize(30),
    left: "60%",
  },
  hideButton: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: scaleSize(5),
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

  DaysRow: {
    flexDirection: "row",
    paddingHorizontal: scaleSize(20),
    marginTop: scaleSize(10),
  },
  DayButton: {
    flex: 1,
    borderColor: "white",
    borderWidth: scaleSize(1),
    borderRadius: 3,
    marginHorizontal: scaleSize(2),
  },
  selectedDayButton: {
    flex: 1,
    borderColor: "white",
    backgroundColor: "white",
    borderWidth: scaleSize(1),
    borderRadius: 3,
    marginHorizontal: scaleSize(3),
  },
  DayText: {
    color: "white",
    textAlign: "center",
    paddingVertical: scaleSize(5),
  },
  selectedDayText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: scaleSize(5),
  },
});
