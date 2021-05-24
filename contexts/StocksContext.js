import React, { useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState({ Symbols: [] });

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
    if (state.Symbols.indexOf(newSymbol) !== -1) {
      Alert.alert("The company is already in the list");
    } else {
      setState((x) => {
        const newState = x.Symbols.push(newSymbol);
        return newState;
      });
      AsyncStorage.setItem("@Mylist", JSON.stringify(state));
      Alert.alert(`The company ${newSymbol} added to the watch list.`);
    }
  }

  function deleteItem(symbol) {
    console.log(symbol);
    //delete item from the state
    setState((x) => {
      const newState = x.Symbols.filter((item) => item !== symbol);
      return newState;
    });
    console.log(state);
    alert("Item deleted!");
  }

  let retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("@Mylist");
      console.log("Retrieved Data from Async Storage");
      console.log(value);
      if (value !== null) {
        setState(JSON.parse(value));
      }
    } catch (error) {}
  };

  useEffect(() => {
    retrieveData();
  }, []);

  return {
    ServerURL: "http://131.181.190.87:3001",
    watchList: state,
    addToWatchlist,
    deleteItem,
  };
};
