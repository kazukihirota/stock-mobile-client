import React from "react";
import { StocksProvider } from "./contexts/StocksContext";

import { AuthContextProvider } from "./contexts/AuthContext";
import RootStackNavigator from "./navigation/RootStackNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthContextProvider>
        <StocksProvider>
          <RootStackNavigator />
        </StocksProvider>
      </AuthContextProvider>
    </SafeAreaProvider>
  );
}
