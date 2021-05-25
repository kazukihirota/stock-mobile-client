import React, { useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  Button,
  ActivityIndicator,
  Text,
} from "react-native";
import { scaleSize } from "../constants/Layout";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import BottomTabNavigator from "../navigation/BottomTabNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import RootStackNavigator from "../navigation/RootStackNavigator";
import { useAuthContext } from "../contexts/AuthContext";
const Stack = createStackNavigator();

const HomeScreen = () => {
  const { userToken, logoutHandler } = useAuthContext();

  const [isLoading, setIsLoadin] = useState(false);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ color: "white", textAlign: "center" }}>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {Platform.OS === "ios" && <StatusBar barStyle="default" />}
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator>
          {userToken == null ? (
            <Stack.Screen name="Log in" component={RootStackNavigator} />
          ) : (
            <Stack.Screen
              name="Home"
              component={BottomTabNavigator}
              options={{
                headerRight: () => (
                  <Button
                    onPress={() => logoutHandler()}
                    title="Log out"
                    color="white"
                    style={styles.logoutButton}
                  />
                ),
              }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButton: {
    paddingRight: scaleSize(4),
  },
});
export default HomeScreen;
