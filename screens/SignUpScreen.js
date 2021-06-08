import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Button,
  TouchableOpacity,
  TextInput,
  Image,
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
      <View style={{ flexDirection: "row" }}>
        <Image
          source={require("../assets/images/splashIcon2.png")}
          style={styles.icon}
        />
        <Text style={styles.title}>Sign Up</Text>
      </View>
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
        <Text style={styles.description}>
          * Password must contain at least one Capital letter, and number. The
          length must be between 8 and 15 characters.
        </Text>

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
  screen: {
    backgroundColor: "#f0f0f0",
    height: "100%",
    alignItems: "center",
    flex: 1,
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
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  parameter: {
    marginTop: scaleSize(20),
    marginBottom: scaleSize(5),
    fontSize: scaleSize(18),
    fontWeight: "500",
  },
  description: {
    marginBottom: scaleSize(20),
    fontSize: scaleSize(11),
    marginTop: scaleSize(3),
  },
  input: {
    height: scaleSize(30),
    borderWidth: 1,
  },
  signUpButton: {
    alignSelf: "center",
    backgroundColor: "#f24b4b",
    padding: 10,
    borderWidth: scaleSize(0.5),
    borderRadius: 8,
    width: "100%",
    borderColor: "grey",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
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
