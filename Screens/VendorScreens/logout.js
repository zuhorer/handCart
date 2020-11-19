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
} from "react-native";
import { Constants } from "expo";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import Environment from "../../config/environment";
import * as firebase from "firebase";
import { SafeAreaView } from "react-navigation";

import { Marker, MapView } from "react-native-maps";
import Fire from "../../fire/fire";

export default class LogoutScreen extends React.Component {
  logout = () => {
    firebase.auth().signOut();
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={Fire.shared.signOut()}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
