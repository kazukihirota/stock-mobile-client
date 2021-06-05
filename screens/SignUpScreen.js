import React, { useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Button,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from "react-native";
import { scaleSize } from "../constants/Layout";
import { useAuthContext } from "../contexts/AuthContext";

const SignUpScreen = (props) => {
  const { signUp } = useAuthContext();

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
        <Text style={styles.title}>User registration</Text>
        <View style={styles.container}>
          <Text style={styles.parameter}>Enter your email address</Text>
          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            autoCapitalize="none"
          />
          <Text style={styles.parameter}>Enter your Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => signUp(username, password)}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>

          <View style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Have already an account?</Text>
            <Button
              onPress={() => props.navigation.navigate("Log In")}
              title="Log In"
            />
          </View>
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
    alignItems: "center",
  },
  title: {
    fontSize: scaleSize(40),
    fontWeight: "bold",
    color: "white",
    marginTop: scaleSize(70),
    marginBottom: scaleSize(80),
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
  signUpButton: {
    alignSelf: "center",
    backgroundColor: "#f24b4b",
    padding: 10,
    borderWidth: scaleSize(0.5),
    borderRadius: 8,
    borderColor: "grey",
    width: "100%",
  },
  loginButton: {
    marginBottom: scaleSize(10),
    marginTop: scaleSize(8),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    fontSize: scaleSize(15),
  },
  loginButtonText: {
    color: "black",
    fontSize: scaleSize(14),
  },
});
export default SignUpScreen;
