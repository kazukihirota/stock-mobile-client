import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { scaleSize } from "../constants/Layout";
import { Entypo } from "@expo/vector-icons";
const SplashScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <Image
        source={require("../assets/images/splashIcon2.png")}
        style={styles.image}
      />
      <Text style={styles.description}>
        View and analyse the stock market in a customisable watchlist
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Log In")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
        <Entypo
          name="arrow-with-circle-right"
          size={scaleSize(30)}
          color="white"
          style={{ paddingLeft: scaleSize(10) }}
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f0f0f0",
    height: "100%",
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: scaleSize(250),
    height: scaleSize(250),
    marginTop: scaleSize(70),
    marginBottom: scaleSize(70),
  },
  description: {
    fontSize: scaleSize(20),
    color: "#393939",
    marginBottom: scaleSize(50),
    width: "80%",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#454343",
    padding: scaleSize(10),
    borderRadius: 3,
    width: "80%",
    flexDirection: "row",
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
