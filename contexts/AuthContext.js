import React, { useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = React.createContext();

export const AuthContextProvider = ({ children }) => {
  const [state, setState] = useState(null);

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const SERVER_URL = "http://localhost:3001";
  const [userToken, setUserToken] = useContext(AuthContext);

  function logoutHandler() {
    setUserToken(null);
    AsyncStorage.removeItem("@loggedIn");
    console.log("logged out!");
  }

  function loginHandler(username, password) {
    const url = `${SERVER_URL}/users/login`;
    fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email: username, password: password }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setUserToken(res.token);
        if (userToken === null) {
          alert("Incorrect login information.");
        } else {
          AsyncStorage.setItem("@loggedIn", userToken);
          console.log("logged in!");
        }
      });
  }

  let retrieveAuthData = async () => {
    try {
      const value = await AsyncStorage.getItem("@loggedIn");
      console.log(value);
      if (value !== null) {
        setUserToken(value);
      }
    } catch (error) {}
  };

  useEffect(() => {
    retrieveAuthData();
    console.log("rendered");
  }, []);

  return { userToken, logoutHandler, loginHandler };
};
