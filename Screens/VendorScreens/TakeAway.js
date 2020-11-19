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

export default class ReadyTakeAways extends React.Component {
  /* CheckVendorStatus() {
    if (this.state.vendor == false) {
     // return (
        
      )z
    } else {
      return this.props.navigation.navigate("VendorSignedHome");
    }
  }
  signOutUser = () => {
    firebase.auth().signOut();
  };
*/
  render() {
    return (
      <View style={styles.container}>
        <Text>Take aways Ready!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
