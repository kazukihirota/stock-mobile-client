import React, { useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState({ myList: [] });

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  // can put more code here

  function addToWatchlist(newSymbol) {
    //check if the symbol already exists in the list
    if (state.myList.indexOf(newSymbol) !== -1) {
      Alert.alert("The company is already in the list");
    } else {
      setState((x) => {
        x.myList.push(newSymbol);
        return x;
      });
      AsyncStorage.setItem("@Mylist", JSON.stringify(state));
      console.log(state);
      Alert.alert(`The company ${newSymbol} added to the watch list.`);
    }
  }

  let retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("@Mylist");
      console.log("Retrieved Data");
      console.log(value);
      if (value !== null) {
        setState(JSON.parse(value));
      }
    } catch (error) {}
  };

  useEffect(() => {
    // FixMe: Retrieve watchlist from persistent storage
    retrieveData();
  }, []);

  return {
    ServerURL: "http://131.181.190.87:3001",
    watchList: state,
    addToWatchlist,
  };
};
