import React from "react";
import { StocksProvider } from "./contexts/StocksContext";

import { AuthContextProvider } from "./contexts/AuthContext";
import HomeScreen from "./screens/HomeScreen";

export default function App() {
  return (
    <AuthContextProvider>
      <StocksProvider>
        <HomeScreen />
      </StocksProvider>
    </AuthContextProvider>
  );
}
