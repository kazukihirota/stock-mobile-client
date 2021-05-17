import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ScrollView,
  Touchable,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";
import { FontAwesome } from "@expo/vector-icons";

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext(); //passing the function
  //for error and loading state handling
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [companyData, setCompanyData] = useState([]);

  // can put more code here

  const companyOvervieURL =
    "https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=a061788633309dc50960045d59051a3a";
  //need to fetch symbol, name, open, close, low, high, volume
  useEffect(() => {
    fetch(companyOvervieURL)
      .then((res) => res.json())
      .then((data) =>
        data.map((company) => {
          return {
            symbol: company.symbol,
            name: company.name,
            industry: company.sector,
          };
        })
      )
      .then(
        (companies) => {
          setIsLoaded(true);
          setCompanyData(companies);
          console.log(companyData);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);
  // if (error) {
  //   return (
  //     <View>
  //       <Text>Error: {error.message}</Text>
  //     </View>
  //   );
  // } else if (!isLoaded) {
  //   return (
  //     <View>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // } else {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <SearchBar />
        <ScrollView style={styles.container}>
          {companyData.map((x) => (
            <CompanyList {...x} key={x.symbol} />
          ))}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

function CompanyList(props) {
  return (
    <TouchableOpacity style={styles.company_container} onPress={() => {}}>
      <Text style={styles.symbol}>{props.symbol}</Text>
      <Text style={styles.name}>{props.name}</Text>
    </TouchableOpacity>
  );
}

function SearchBar() {
  return (
    <View style={styles.searchbar}>
      <Text style={styles.textInputTitle}>
        Type a company name or stock symbol
      </Text>
      <View style={styles.textInputContainer}>
        <FontAwesome name="search" size={24} color="white" />
        <TextInput
          name="input"
          style={styles.textInput}
          onChangetText={(e) => {}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens

  searchbar: {
    alignItems: "center",
    marginBottom: scaleSize(10),
  },
  textInputTitle: {
    color: "white",
    textAlign: "center",
    margin: scaleSize(5),
  },
  textInputContainer: {
    flexDirection: "row",
  },
  textInput: {
    flex: 1,
    borderColor: "white",
    color: "white",
    borderWidth: 1,
    height: 30,
    marginHorizontal: scaleSize(5),
  },
  company_container: {
    borderBottomColor: "white",
    borderBottomWidth: 0.5,
    paddingLeft: scaleSize(15),
  },
  symbol: {
    color: "white",
    fontSize: 20,
    paddingVertical: scaleSize(5),
  },
  name: {
    color: "white",
    paddingVertical: scaleSize(5),
  },
});
