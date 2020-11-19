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

export default class VendorHomeScreen extends React.Component {
  state = {
    email: "",
    displayName: "",
    vendorstatus: "",
  };
  async componentDidMount() {
    const { email, displayName } = firebase.auth().currentUser;
    this.setState({ email, displayName });
    let status = await Fire.shared.checkvendorstatus();
    //alert(status);
    this.setState({ vendorstatus: status });
  }

  /*signOutUser = () => {
    firebase.auth().signOut();
  };*/

  render() {
    const { vendorstatus } = this.state;
    if (vendorstatus == "true") {
      return (
        <View>
          <TouchableOpacity
            style={{ alignSelf: "center", marginTop: 32 }}
            onPress={() => this.props.navigation.navigate("VendorActualHome")}
          >
            <Text
              style={{
                fontWeight: "500",
                color: "#E9446A",
                fontSize: 13,
                alignSelf: "center",
              }}
            >
              click me!
            </Text>
            <Text
              style={{ marginTop: 12, fontWeight: "500", color: "#E9446A" }}
            >
              Let's Check out your Virtual Store!
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (vendorstatus == "false") {
      return (
        <TouchableOpacity
          style={{ alignSelf: "center", marginTop: 32 }}
          onPress={() => this.props.navigation.navigate("VendorRegister")}
        >
          <Text style={{ color: "#414959", fontSize: 13 }}>
            <Text style={{ fontWeight: "500", color: "#E9446A" }}>
              Would You Like to register?
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
} /* 

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
