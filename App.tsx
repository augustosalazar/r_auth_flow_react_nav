import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { useColorScheme } from "./app-example/hooks/use-color-scheme.web";
import AuthFlow from "./src/AuthFlow";
import { AuthProvider } from "./src/context/authContext";
import { ProductProvider } from "./src/features/products/presentation/context/productContext";
import { darkTheme, lightTheme } from "./src/theme/theme";



export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  return (

      <PaperProvider theme={theme}>
        <AuthProvider>
          <ProductProvider>
            <NavigationContainer>
              <AuthFlow />
            </NavigationContainer>
          </ProductProvider>
        </AuthProvider>
      </PaperProvider>

  );
}