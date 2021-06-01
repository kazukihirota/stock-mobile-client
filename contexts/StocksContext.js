import React, { useState, useContext, useEffect, useRef } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthContext } from "./AuthContext";
import { render } from "react-dom";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);
  const renderRef = useRef(false);
  const { user } = useAuthContext();
  const userId = user.userId;
  const userToken = user.token;
  const SERVER_URL = "http://localhost:3001";

  function addToWatchlist(newSymbol) {
    //check if the symbol already exists in the list
    if (state.indexOf(newSymbol) !== -1) {
      Alert.alert("The company is already in the list");
    } else {
      setState((oldArray) => [...oldArray, newSymbol]);
      Alert.alert(`The company ${newSymbol} added to the watch list.`);
      saveDataOnServer(newSymbol);
    }
  }
  useEffect(() => {
    if (renderRef.current) {
      try {
        AsyncStorage.setItem("@Mylist", JSON.stringify(state));
        console.log("state in stock context", state);
      } catch (error) {
        console.log("Asynstorage error", error.message);
      }
    } else {
      renderRef.current = true;
    }
  }, [state]);

  //function to save watchlist data on the server
  function saveDataOnServer(symbol) {
    const url = `${SERVER_URL}/watchlist/update`;
    fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({ userId: userId, symbol: symbol }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      });
  }

  function deleteItem(symbol) {
    console.log(symbol);
    //delete item from the state
    setState(state.filter((item) => item !== symbol));
    console.log(state);
    alert("Item deleted!");
  }

  let retrieveData = async () => {
    try {
      console.log("\nretrieving data from async storage");
      const value = await AsyncStorage.getItem("@Mylist");
      if (value !== null) {
        setState(JSON.parse(value));
      }
    } catch (error) {}
  };

  useEffect(() => {
    retrieveData();
  }, []);

  return {
    watchList: state,
    addToWatchlist,
    deleteItem,
  };
};
