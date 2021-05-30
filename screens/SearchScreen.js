import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";
import { FontAwesome } from "@expo/vector-icons";
import { useAuthContext } from "../contexts/AuthContext";

export default function SearchScreen() {
  const { addToWatchlist } = useStocksContext(); //passing the function
  const { user } = useAuthContext();
  //for error and loading state handling
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [companyDataBackUp, setCompanyDataBackUp] = useState([]);

  const companyOverviewURL =
    "https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=a061788633309dc50960045d59051a3a";
  //need to fetch symbol, name, open, close, low, high, volume
  useEffect(() => {
    fetch(companyOverviewURL)
      .then((res) => res.json())
      .then((data) =>
        data.map((company) => {
          return {
            symbol: company.symbol,
            name: company.name,
          };
        })
      )
      .then(
        (companies) => {
          setIsLoaded(true);
          setCompanyData(companies);
          setCompanyDataBackUp(companies);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);
  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <SearchCompanyBar
            setCompanyData={setCompanyData}
            companyDataBackUp={companyDataBackUp}
          />
          <ScrollView>
            {companyData.map((x) => (
              <CompanyList
                data={x}
                addToWatchlist={addToWatchlist}
                key={x.symbol}
              />
            ))}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

function CompanyList(props) {
  return (
    <TouchableOpacity
      style={styles.companyRow}
      onPress={() => props.addToWatchlist(props.data.symbol)}
    >
      <Text style={styles.symbol}>{props.data.symbol}</Text>
      <Text style={styles.name}>{props.data.name}</Text>
    </TouchableOpacity>
  );
}

function SearchCompanyBar(props) {
  return (
    <View style={styles.searchbar}>
      <Text style={styles.textInputTitle}>
        Type a company name or stock symbol
      </Text>
      <View style={styles.textInputContainer}>
        <FontAwesome name="search" size={24} color="white" />
        <TextInput
          name="input"
          autoCapitalize="none"
          style={styles.textInputBox}
          onChangeText={(text) =>
            filterCompanyBySymbol(
              text,
              props.setCompanyData,
              props.companyDataBackUp
            )
          }
        />
      </View>
    </View>
  );
}

function filterCompanyBySymbol(input, setCompanyData, companyDataBackUp) {
  console.log(typeof input);
  if (input.length === 0) {
    setCompanyData(companyDataBackUp);
  } else {
    const text = input.toLowerCase();
    const filteredCompany = companyDataBackUp.filter((company) => {
      return (
        company.symbol.toLowerCase().includes(text) ||
        company.name.toLowerCase().includes(text)
      );
    });
    setCompanyData(filteredCompany);
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: scaleSize(5),
  },
  searchbar: {
    alignItems: "center",
    marginBottom: scaleSize(10),
  },
  textInputTitle: {
    color: "white",
    textAlign: "center",
    margin: scaleSize(8),
  },
  textInputContainer: {
    flexDirection: "row",
  },
  textInputBox: {
    flex: 1,
    borderColor: "white",
    color: "white",
    borderWidth: 1,
    height: 30,
    marginHorizontal: scaleSize(5),
  },
  companyRow: {
    borderBottomColor: "#F0F8FF",
    borderBottomWidth: 0.5,
    paddingLeft: scaleSize(15),
    paddingVertical: scaleSize(4),
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
