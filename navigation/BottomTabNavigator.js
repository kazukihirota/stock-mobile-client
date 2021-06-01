import * as React from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
import StocksScreen from "../screens/StocksScreen";
import SearchScreen from "../screens/SearchScreen";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Stocks";

export default function BottomTabNavigator({ navigation, route }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  }, [navigation, route]);

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Stocks"
        component={StocksScreen}
        options={{
          title: "Stocks",

          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-trending-up" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-search" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  return getFocusedRouteNameFromRoute(route) ?? INITIAL_ROUTE_NAME;
}
