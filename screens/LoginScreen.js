import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { scaleSize } from "../constants/Layout";
import { useAuthContext } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const clearStorage = async () => {
  AsyncStorage.clear();
  console.log("Async storage cleared!");
};

const LoginScreen = (props) => {
  const { loginHandler } = useAuthContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={require("../assets/images/splashIcon2.png")}
          style={styles.icon}
        />
        <Text style={styles.title}>Login</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.parameter}>User name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          autoCapitalize="none"
        />
        <Text style={styles.parameter}>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          autoCapitalize="none"
          secureTextEntry={true}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => loginHandler(username, password)}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => {
            props.navigation.navigate("Sign Up");
          }}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f0f0f0",
    height: "100%",
    flex: 1,
    alignItems: "center",
  },
  icon: {
    width: scaleSize(50),
    height: scaleSize(50),
    marginVertical: scaleSize(70),
  },
  title: {
    fontSize: scaleSize(40),
    fontWeight: "bold",
    color: "black",
    marginVertical: scaleSize(70),
    paddingLeft: scaleSize(10),
  },
  container: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
    width: "80%",
    maxWidth: scaleSize(400),
    maxHeight: scaleSize(400),
    padding: scaleSize(20),
    marginTop: scaleSize(10),
  },
  parameter: {
    marginBottom: scaleSize(5),
    fontSize: scaleSize(13),
    fontWeight: "500",
  },
  input: {
    height: scaleSize(30),
    marginBottom: scaleSize(20),
    borderWidth: 1,
  },
  loginButton: {
    alignSelf: "center",
    backgroundColor: "#454343",
    padding: 10,
    borderWidth: scaleSize(1),
    marginBottom: scaleSize(17),
    borderRadius: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  signUpButton: {
    alignSelf: "center",
    backgroundColor: "#f24b4b",
    padding: 10,
    borderWidth: scaleSize(0.5),
    borderColor: "grey",
    borderRadius: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    fontSize: scaleSize(15),
  },
});
export default LoginScreen;
