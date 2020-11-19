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
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ImagePicker, Permissions } from "expo";
import Environment from "../../config/environment";
import * as firebase from "firebase";
import Fire from "../../fire/fire";
import { Ionicons, Feather, EvilIcons, AntDesign } from "@expo/vector-icons";
export default class VendorHomeScreen extends React.Component {
  state = {
    email: "",
    displayName: "",
    Customerstatus: "",
  };
  async componentDidMount() {
    const { email, displayName } = firebase.auth().currentUser;
    this.setState({ email, displayName });
    let status = await Fire.shared.checkCustomerstatus();
    //alert(status);
    this.setState({ Customerstatus: status });
  }
  AddingCustomer = async () => {
    alert("Hi");
    await Fire.shared.addNewCustomer().then((ref) => {
      this.setState({ Customerstatus: "true" });
      //alert(this.state.Customerstatus);
    });
  };
  /*signOutUser = () => {
    firebase.auth().signOut();
  };*/
  ifTrue = () => {
    this.props.navigation.navigate("Home");
  };
  render() {
    const { Customerstatus } = this.state;
    if (Customerstatus == "true") {
      {
        this.ifTrue();
      }
      return (
        <TouchableOpacity
          style={{ alignSelf: "center", marginTop: 32 }}
          onPress={() => this.props.navigation.navigate("Home")}
        >
          <Text style={{ color: "#414959", fontSize: 13 }}>
            <Text style={{ fontWeight: "500", color: "#E9446A" }}>
              move to customer options Customer!
            </Text>
          </Text>
        </TouchableOpacity>
      );
    }
    if (Customerstatus == "false") {
      return (
        <TouchableOpacity
          style={{ alignSelf: "center", marginTop: 32 }}
          onPress={() => this.AddingCustomer()}
        >
          <Text style={{ color: "#414959", fontSize: 13 }}>
            <Text style={{ fontWeight: "500", color: "#E9446A" }}>
              click here to register as Customer.
            </Text>
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }
}
/* 

<Button
          style={{ marginTop: 32 }}
          onpress={() => this.props.navigation.navigate("Logout")}
          title="Log Out"
        />*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
