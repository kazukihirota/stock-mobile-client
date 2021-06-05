import React from "react";
import { Platform, StyleSheet, View, StatusBar, Button } from "react-native";
import { scaleSize } from "../constants/Layout";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import BottomTabNavigator from "../navigation/BottomTabNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import RootStackNavigator from "../navigation/RootStackNavigator";
import { useAuthContext } from "../contexts/AuthContext";
import { useStocksContext } from "../contexts/StocksContext";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity, Text } from "react-native";
const Stack = createStackNavigator();

const HomeScreen = () => {
  const { user, logoutHandler } = useAuthContext();
  const { syncWatchListWithServer } = useStocksContext();

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
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => logoutHandler()}
                  >
                    <Text style={styles.syncText}>Log out</Text>
                  </TouchableOpacity>
                ),
                headerLeft: () => (
                  <TouchableOpacity
                    onPress={() => syncWatchListWithServer()}
                    style={styles.syncButton}
                  >
                    <Text style={styles.syncText}>Sync</Text>
                    <FontAwesome5 name="sync-alt" size={20} color="white" />
                  </TouchableOpacity>
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
    paddingRight: scaleSize(6),
  },
  syncButton: {
    paddingLeft: scaleSize(6),
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  syncText: {
    color: "white",
    fontSize: scaleSize(15),
    paddingRight: scaleSize(6),
  },
});
export default HomeScreen;
