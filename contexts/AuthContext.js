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
  const SERVER_URL = "http://172.22.25.193:3001";
  const [user, setUser] = useContext(AuthContext);

  function signUp(username, password) {
    const url = `${SERVER_URL}/users/register`;
    //password and username validation
    if (username == "" || password == "") {
      alert("username or password cannot be empty");
    } else if (!username.includes("@")) {
      alert("Invalid email form");
    } else if (password.length < 8) {
      alert("Password length must be at least 8 characters");
    } else if (password.length > 15) {
      alert("Password length must not exceed 15 characters");
    } else if (!password.match(/[A-Z]/g)) {
      alert("Password must contain at least one capital letter");
    } else if (!password.match(/[0-9]/g)) {
      alert("Password must contain at least one number");
    } else {
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
          alert("User registered!");
        });
    }
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
        if (res.error === true) {
          alert(res.message);
        } else {
          setUser({ token: res.token, userId: res.userId });
          storeUserData(JSON.stringify(res));
        }
      });
  }
  function logoutHandler() {
    setUser({ token: null, userId: null });
    AsyncStorage.removeItem("@loggedIn");
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

  return { user, loginHandler, logoutHandler, signUp };
};
