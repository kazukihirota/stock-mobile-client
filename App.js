import React, { useState } from "react";
import { Platform, StyleSheet, View, StatusBar } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import LoginScreen from "./screens/LoginScreen";
import { StocksProvider } from "./contexts/StocksContext";

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  //implement login function

  return (
    <View style={styles.container}>
      <StocksProvider>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <NavigationContainer theme={DarkTheme}>
          <Stack.Navigator>
            {isLoggedIn == false && (
              <Stack.Screen name="Login" component={LoginScreen} />
            )}
            {isLoggedIn == true && (
              <Stack.Screen name="Home" component={BottomTabNavigator} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </StocksProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
