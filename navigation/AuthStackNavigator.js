import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SplashScreen from "../screens/SplashScreen";

const AuthStack = createStackNavigator();

const AuthStackNavigator = ({ navigation, route }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: getFocusedRouteNameFromRoute(route) });
  }, [navigation, route]);
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Get Started"
        component={SplashScreen}
        options={{ headerShown: false, headerBackTitleVisible: false }}
      />
      <AuthStack.Screen
        name="Log In"
        component={LoginScreen}
        options={{ headerShown: false, headerBackTitleVisible: false }}
      />

      <AuthStack.Screen
        name="Sign Up"
        component={SignUpScreen}
        options={{ headerShown: false, headerBackTitleVisible: false }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
