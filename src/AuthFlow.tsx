import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useAuth } from "./context/authContext";
import login from "./features/auth/presentation/login";
import signup from "./features/auth/presentation/signup";
import AddProductScreen from "./features/products/presentation/screens/AddProductScreen";
import ProductListScreen from "./features/products/presentation/screens/ProductListScreen";
import settings from "./settings";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ProductsStack = createStackNavigator();


export default function AuthFlow() {
  const { isLoggedIn } = useAuth();

  function ProductsStackScreen() {
    return (
      <ProductsStack.Navigator>
        <ProductsStack.Screen
          name="Main"
          component={ProductListScreen}
          options={{ headerShown: false }}
        />
        <ProductsStack.Screen
          name="AddProductScreen"
          component={AddProductScreen}
          options={{ title: "Add Product" }}
        />
        <ProductsStack.Screen
          name="UpdateProductScreen"
          component={AddProductScreen}
          options={{ title: "Update Product" }}
        />
      </ProductsStack.Navigator>
    );
  }

  function ContentTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={ProductsStackScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="house" size={24} color={color} iconStyle="solid" />
            )
          }} />
        <Tab.Screen name="Profile" component={settings}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="user" size={24} color={color} />
            )
          }} />
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
          />
        </>
      )}
    </Stack.Navigator>
  );
}