import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};
