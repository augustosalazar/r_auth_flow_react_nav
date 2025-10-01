import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import AuthFlow from "./src/AuthFlow";
import { AuthProvider } from "./src/context/authContext";
import { ProductProvider } from "./src/features/products/presentation/context/productContext";
import { darkTheme, lightTheme } from "./src/theme/theme";



export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  console.log("Current theme:", scheme);
  //console.log("Using theme:", theme);

  const navigationTheme = {
    ...(scheme === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(scheme === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outline,
      primary: theme.colors.primary,
      notification: theme.colors.error,
    },
  };

  return (

    <PaperProvider theme={theme}>
      <AuthProvider>
        <ProductProvider>
          <NavigationContainer theme={navigationTheme}>
            <AuthFlow />
          </NavigationContainer>
        </ProductProvider>
      </AuthProvider>
    </PaperProvider>

  );
}