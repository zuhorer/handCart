import {
  NavigationContainer,
  createSwitchNavigator,
  createAppContainer,
} from "react-navigation";
import { View } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { enableScreens } from "react-native-screens";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import React from "react";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import home from "../Screens/CustomerScreens/coustomercheckscreen";
import CustomerHomeScreen from "../Screens/CustomerScreens/Home";
import CustomerListScreen from "../Screens/CustomerScreens/ListScreen";
import CustomerAnimatedListScreen from "../Screens/CustomerScreens/AnimatedListScreen";
import PickedOrders from "../Screens/CustomerScreens/PickedScreen";
import CustomerPlacedScreen from "../Screens/CustomerScreens/PlacedScreen";
import allLists from "../Screens/CustomerScreens/AllListScreen";
import CustomerDraftsScreen from "../Screens/CustomerScreens/CustomerDrafts";

import ListFinalScreen from "../Screens/CustomerScreens/ListFinalScreen";

import CustomerCart from "../Screens/CustomerScreens/CartScreen";
import CustomerMap from "../Screens/CustomerScreens/MapViewScreen";
import CustomerTrack from "../Screens/CustomerScreens/TrackPage";
import CustomerConfirmation from "../Screens/CustomerScreens/ConfirmationScreen";
import VendorDetails from "../Screens/CustomerScreens/ViewVendor";

enableScreens();
const Hi = createSharedElementStackNavigator({
  Home: {
    screen: CustomerHomeScreen,
    headerMode: "none",
    navigationOptions: {
      headerShown: false,
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
  List: {
    screen: CustomerAnimatedListScreen,
    headerMode: "none",
    navigationOptions: {
      headerShown: false,
      gestureEnabled: false,
      tabBarLabel: "Create",
      transitionSpec: {
        open: { animation: "timing", config: { duration: 500 } },
        close: { animation: "timing", config: { duration: 500 } },
      },
      cardStyleInterpolator: ({ current: { progress } }) => {
        return {
          cardStyle: {
            opacity: progress,
          },
        };
      },
      tabBarIcon: ({ tintColour }) => (
        <View>
          <Entypo style={{ color: "#E9446A" }} name="list" size={30} />
        </View>
      ),
    },
  },
});

const HOME = createMaterialBottomTabNavigator({
  Home: {
    screen: CustomerHomeScreen,
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
  List: {
    screen: CustomerListScreen,
    navigationOptions: {
      tabBarLabel: "Create",
      tabBarIcon: ({ tintColour }) => (
        <View>
          <Entypo style={{ color: "#E9446A" }} name="list" size={30} />
        </View>
      ),
    },
  },
});
const OrderManage = createMaterialBottomTabNavigator({
  DraftLists: {
    screen: CustomerDraftsScreen,
    navigationOptions: {
      tabBarLabel: "Drafts",
      tabBarIcon: ({ tintColour }) => (
        <View>
          <Entypo style={{ color: "#E9446A" }} name="list" size={30} />
        </View>
      ),
    },
  },
  PlacedOrders: {
    screen: CustomerPlacedScreen,
    navigationOptions: {
      tabBarLabel: "PlacedOrders",
      tabBarIcon: ({ tintColour }) => (
        <View>
          <Entypo style={{ color: "#E9446A" }} name="list" size={30} />
        </View>
      ),
    },
  },
  ReadyOrders: {
    screen: allLists,
    navigationOptions: {
      tabBarLabel: "ReadyOrders",
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
  PickedOrders: {
    screen: PickedOrders,
    navigationOptions: {
      headerShown: false,
      tabBarLabel: "Confirmations",
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
});

const CustomerAppStack = createStackNavigator({
  AlterHome: { screen: home, navigationOptions: { headerShown: false } },
  HOME: { screen: Hi, navigationOptions: { headerShown: false } },
  ManageOrders: OrderManage,
  ListFinal: ListFinalScreen,
  TRACK: CustomerTrack,
  CONFIRMATION: CustomerConfirmation,
  CART: CustomerCart,
  MAP: CustomerMap,
  VendorDetails: VendorDetails,
});

export default createSwitchNavigator(
  {
    CustomerApp: CustomerAppStack,
  }
  /*{
    initialRouteName: "List",
  }*/
);
