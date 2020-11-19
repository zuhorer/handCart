import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import "react-native-gesture-handler";

//commonScreens
import RootDrawerNavigator from "./Navigaition/Drawer";
import LoadingScreen from "./Screens/LoadingScreen";
import HomeScreen from "./Screens/HomeScreen";
import LoginScreen from "./Screens/LoginScreen";
import CustomerLoginScreen from "./Screens/CustomerScreens/LoginScreen";
import VendorLoginScreen from "./Screens/CustomerScreens/LoginScreen";
import VendorRegisterScreen from "./Screens/VendorScreens/RegisterScreen";
import CustomerRegisterScreen from "./Screens/CustomerScreens/RegisterScreen";
import RegisterScreen from "./Screens/RegisterScreen";

//CustomerScreens
import Test from "./Screens/CustomerScreens/Test";
import CustomerHomeScreen from "./Screens/CustomerScreens/Home";
import CustomerListScreen from "./Screens/CustomerScreens/ListScreen";
import CustomerCart from "./Screens/CustomerScreens/CartScreen";
import CustomerMap from "./Screens/CustomerScreens/MapViewScreen";
import CustomerTrack from "./Screens/CustomerScreens/TrackPage";
import CustomerConfirmation from "./Screens/CustomerScreens/ConfirmationScreen";

//VendorScreens
import VendorHomeScreen from "./Screens/VendorScreens/Home";

import * as firebase from "firebase";
import Fire from "./fire/fire";

/*const VendorAppStack = createStackNavigator({
  VendorLogin: VendorLoginScreen,
  VendorRegister: VendorRegisterScreen,
  VendorHome: VendorHomeScreen,
});

const CustomerAppStack = createStackNavigator({
  CustomerLogin: CustomerLoginScreen,
  CustomerRegister: CustomerRegisterScreen,

  List: CustomerListScreen,
  Home: CustomerHomeScreen,
  CART: CustomerCart,
  MAP: CustomerMap,
  TRACK: CustomerTrack,
  CONFIRMATION: CustomerConfirmation,
});

});
*/

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
});
export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: RootDrawerNavigator,
      Auth: AuthStack,
    },
    {
      initialRouteName: "Loading",
    }
  )
);
