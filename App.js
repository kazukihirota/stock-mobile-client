import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  Button,
  ActivityIndicator,
  Text,
} from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import { StocksProvider } from "./contexts/StocksContext";
import { scaleSize } from "./constants/Layout";
import { AuthContextProvider, useAuthContext } from "./contexts/AuthContext";
import RootStackNavigator from "./navigation/RootStackNavigator";
import HomeScreen from "./screens/HomeScreen";

export default function App(props) {
  return (
    <AuthContextProvider>
      <StocksProvider>
        <HomeScreen />
      </StocksProvider>
    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButton: {
    paddingRight: scaleSize(4),
  },
});
