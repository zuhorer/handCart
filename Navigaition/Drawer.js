import { createDrawerNavigator } from "react-navigation-drawer";

import CustomerStackNavigator from "./CustomerStackNavigator";
import VendorStackNavigator from "./VendorStackNavigator";
import LogoutScreen from "../Screens/VendorScreens/logout";
const RootDrawerNavigator = createDrawerNavigator({
  Customer: {
    screen: CustomerStackNavigator,
  },
  vendor: {
    screen: VendorStackNavigator,
  },
  Logout: {
    screen: LogoutScreen,
  },
});
export default RootDrawerNavigator;
