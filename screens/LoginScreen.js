import React, { useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from "react-native";
import { scaleSize } from "../constants/Layout";
import { useAuthContext } from "../contexts/AuthContext";

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
      <ImageBackground
        source={require("../assets/images/hero.jpg")}
        style={styles.image}
        imageStyle={{ opacity: 0.5 }}
      >
        <Text style={styles.title}>Stock Up</Text>
        <Text style={styles.subTitle}>Mobile</Text>

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
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#edebe6",
    height: "100%",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: scaleSize(60),
    fontWeight: "bold",
    color: "white",
    marginBottom: scaleSize(4),
    textShadowColor: "black",
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 1,
  },
  subTitle: {
    fontSize: scaleSize(40),
    fontWeight: "bold",
    color: "white",
    marginBottom: scaleSize(50),
    textShadowColor: "black",
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 1,
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
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
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
    borderColor: "grey",
    shadowColor: "grey",
    borderRadius: 8,
    width: "100%",
  },
  signUpButton: {
    alignSelf: "center",
    backgroundColor: "#f24b4b",
    padding: 10,
    borderColor: "grey",
    borderWidth: scaleSize(0.5),
    borderRadius: 8,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    fontSize: scaleSize(15),
  },
});
export default LoginScreen;
