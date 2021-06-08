import React, { useState, useContext, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthContext } from "./AuthContext";

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
  const SERVER_URL = "http://172.22.25.193:3001";

  function addToWatchlist(newSymbol) {
    //check if the symbol already exists in the list
    if (state.indexOf(newSymbol) !== -1) {
      alert("The company is already in the list");
    } else {
      setState((oldArray) => [...oldArray, newSymbol]);
      alert(`The company ${newSymbol} added to the watch list.`);
      saveDataOnServer(newSymbol);
    }
  }
  //callback function to save watchlist in the async storage
  useEffect(() => {
    if (renderRef.current) {
      //preventing setItem when the application initiates
      try {
        AsyncStorage.setItem(`MyList${userId}`, JSON.stringify(state));
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
    }).then((res) => res.json());
  }

  function deleteItem(symbol) {
    //delete item from the state
    setState(state.filter((item) => item !== symbol));
    //delete Item from the server too
    deleteItemOnServer(symbol);
  }

  function deleteItemOnServer(symbol) {
    const url = `${SERVER_URL}/watchlist/delete`;
    fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({ userId: userId, symbol: symbol }),
    }).then((res) => res.json());
  }

  function syncWatchListWithServer() {
    const url = `${SERVER_URL}/watchlist/sync/${userId}`;
    fetch(url)
      .then((res) => res.json())
      .then((obj) => {
        setState(obj.Symbols);
      });
  }

  //retrieve data when rendered
  let retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem(`MyList${userId}`);
      if (value !== null) {
        setState(JSON.parse(value));
      } else {
        setState([]);
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
    syncWatchListWithServer,
  };
};
