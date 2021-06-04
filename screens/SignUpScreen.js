import React, { useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Button,
  TouchableOpacity,
  TextInput,
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
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: scaleSize(40),
    fontWeight: "bold",
    marginVertical: scaleSize(70),
    textShadowColor: "grey",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 0.26,
  },
  screen: {
    backgroundColor: "#edebe6",
    height: "100%",
    flex: 1,

    alignItems: "center",
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
