import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { scaleSize } from "../constants/Layout";

const SplashScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <ImageBackground
        source={require("../assets/images/hero.jpg")}
        style={styles.image}
        imageStyle={{ opacity: 0.8 }}
      >
        <Text style={styles.title}>Stock Up</Text>
        <Text style={styles.subTitle}>Mobile</Text>
        <Text style={styles.description}>
          Welcome to the stock up mobile application. This app allows you
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Log In")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#878787",
    height: "100%",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
  },

  title: {
    fontSize: scaleSize(60),
    fontWeight: "bold",
    color: "white",
    marginBottom: scaleSize(4),
    marginTop: scaleSize(40),
    textShadowColor: "black",
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 1,
  },
  subTitle: {
    fontSize: scaleSize(50),
    fontWeight: "bold",
    color: "white",
    marginBottom: scaleSize(50),
    textShadowColor: "black",
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 1,
  },
  description: {
    fontSize: scaleSize(30),
    color: "white",
    marginBottom: scaleSize(50),
    textShadowColor: "black",
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 1,
    padding: scaleSize(20),
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#454343",
    padding: scaleSize(10),
    borderRadius: 3,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: scaleSize(30),
  },
});
export default SplashScreen;
