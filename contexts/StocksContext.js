import React, { useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([
    { Symbol: "IBM", Name: "IBM company" },
    { Symbol: "Zoom", Name: "Zoom company" },
  ]);

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
    //FixMe: add the new symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage
  }

  let retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("@Log");
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
