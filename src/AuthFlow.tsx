import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "./context/authContext";
import login from "./features/auth/presentation/login";
import signup from "./features/auth/presentation/signup";
import productList from "./features/products/presentation/screens/productList";
import settings from "./settings";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


export default function AuthFlow() {
    const { isLoggedIn } = useAuth();

    function ContentTabs() {
        return (
            <Tab.Navigator>
                <Tab.Screen name="Home" component={productList} />
                <Tab.Screen name="Profile" component={settings} />
            </Tab.Navigator>
        );
    }

return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="App" component={ContentTabs} />
      ) : (
        <>
          <Stack.Screen name="Login" component={login} />
          <Stack.Screen
            name="Signup"
            component={signup}
            options={{ headerShown: true, title: "Sign Up" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}