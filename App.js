import React from "react";
import { StocksProvider } from "./contexts/StocksContext";

import { AuthContextProvider } from "./contexts/AuthContext";
import HomeScreen from "./screens/HomeScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthContextProvider>
        <StocksProvider>
          <HomeScreen />
        </StocksProvider>
      </AuthContextProvider>
    </SafeAreaProvider>
  );
}
