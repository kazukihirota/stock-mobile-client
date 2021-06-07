import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SplashScreen from "../screens/SplashScreen";

const RootStack = createStackNavigator();

const RootStackNavigator = ({ navigation, route }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: getFocusedRouteNameFromRoute(route) });
  }, [navigation, route]);
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Get Started"
        component={SplashScreen}
        options={{ headerShown: false, headerBackTitleVisible: false }}
      />
      <RootStack.Screen
        name="Log In"
        component={LoginScreen}
        options={{ headerShown: false, headerBackTitleVisible: false }}
      />

      <RootStack.Screen
        name="Sign Up"
        component={SignUpScreen}
        options={{ headerShown: false, headerBackTitleVisible: false }}
      />
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
