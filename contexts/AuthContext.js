import React, { useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = React.createContext();

export const AuthContextProvider = ({ children }) => {
  const [state, setState] = useState({ token: null, userId: null });

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const SERVER_URL = "http://localhost:3001";
  const [user, setUser] = useContext(AuthContext);

  function logoutHandler() {
    setUser({ token: null, userId: null });
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
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.error === true) {
          alert(res.message);
        } else {
          setUser({ token: res.token, userId: res.userId });
          console.log("user logged in!");
          storeUserData(JSON.stringify(res));
        }
      });
  }

  const storeUserData = async (value) => {
    try {
      await AsyncStorage.setItem("@loggedIn", value);
    } catch (e) {}
  };

  let retrieveAuthData = async () => {
    try {
      const value = await AsyncStorage.getItem("@loggedIn");
      if (value !== null) {
        const data = JSON.parse(value);
        setUser({ token: data.token, userId: data.userId });
      }
    } catch (error) {}
  };

  useEffect(() => {
    retrieveAuthData();
  }, []);

  return { user, logoutHandler, loginHandler };
};
