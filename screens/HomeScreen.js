import React from "react";
import { Platform, StyleSheet, View, StatusBar, Button } from "react-native";
import { scaleSize } from "../constants/Layout";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import BottomTabNavigator from "../navigation/BottomTabNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import RootStackNavigator from "../navigation/RootStackNavigator";
import { useAuthContext } from "../contexts/AuthContext";
const Stack = createStackNavigator();

const HomeScreen = () => {
  const { user, logoutHandler } = useAuthContext();

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" && <StatusBar barStyle="default" />}
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator>
          {user.token == null ? (
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
