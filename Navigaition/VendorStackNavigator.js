import {
  NavigationContainer,
  createAppContainer,
  createSwitchNavigator,
} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import React from "react";
import {
  ActivityIndicator,
  Button,
  Clipboard,
  FlatList,
  Image,
  Platform,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  TextInput,
} from "react-native";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
//import LogoutScreen from "../Screens/VendorScreens/logout";
import VendorSignedHome from "../Screens/VendorScreens/VendorSignedHome";
import VendorHomeScreen from "../Screens/VendorScreens/Home";
import VendorLoginScreen from "../Screens/CustomerScreens/LoginScreen";
import VendorRegisterScreen from "../Screens/VendorScreens/RegisterScreen";

import VendorInventory from "../Screens/VendorScreens/Inventory";
import addItems from "../Screens/VendorScreens/newItem";

import ManageOrders from "../Screens/VendorScreens/OrderManage";
import OrderHistory from "../Screens/VendorScreens/OrderHistory";
import OrderView from "../Screens/VendorScreens/OrderView";
import ReadyTakeAways from "../Screens/VendorScreens/TakeAway";
import QrScanner from "../Screens/VendorScreens/Scanner";
import OrderConfirmation from "../Screens/VendorScreens/Confirmation";
//const VendorAuthStack = createStackNavigator({});
const HOME = createMaterialBottomTabNavigator({
  Home: {
    screen: VendorSignedHome,
    navigationOptions: {
      tabBarLabel: "HOME",
      tabBarIcon: ({ tintColour }) => (
        <View>
          <MaterialIcons
            style={{ color: "#E9446A" }}
            name="add-shopping-cart"
            size={30}
          />
        </View>
      ),
    },
  },
  Inventory: {
    screen: VendorInventory,
    navigationOptions: {
      tabBarLabel: "Inventory",
      tabBarIcon: ({ tintColour }) => (
        <View>
          <Entypo style={{ color: "#E9446A" }} name="list" size={30} />
        </View>
      ),
    },
  },
  ViewAllOrders: {
    screen: ManageOrders,
    navigationOptions: {
      tabBarLabel: "Orders",
      tabBarIcon: ({ tintColour }) => (
        <View>
          <Entypo style={{ color: "#E9446A" }} name="list" size={30} />
        </View>
      ),
    },
  },
});
const VendorAppStack = createStackNavigator({
  VendorHome: VendorHomeScreen,
  VendorRegister: VendorRegisterScreen,
  VendorActualHome: HOME,
  newItem: addItems,
  //AddInventory: VendorInventory,
  //ViewAllOrders: ManageOrders,
  ViewIndividualOrder: OrderView,
  //ViewSuccessfullOrder: OrderHistory,
  PickYourOrder: ReadyTakeAways,
  //Logout: LogoutScreen,
  //ConfirmPickup: QrScanner,
  //ConfirmationRecipt: OrderConfirmation,
});
export default createSwitchNavigator({
  //VendorInitial: VendorLoginScreen,
  VendorApp: VendorAppStack,
});
