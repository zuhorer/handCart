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
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import Environment from "../config/environment";
import * as firebase from "firebase";

import Fire from "../fire/fire";
import { SafeAreaView } from "react-navigation";
import { TextInput } from "react-native-gesture-handler";

const Firebase = require("firebase");
require("firebase/firestore");
export default class App extends React.Component {
  state = {
    text: "",
    image: null,
    uploading: false,
    googleResponse: null,
  };
  componentDidMount = async () => {
    this.getPhotoPermission();
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
  };

  getPhotoPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status != "granted") {
      alert("Permission needed to access your camera");
    }
  };

  handlePost = () => {
    Fire.shared
      .addPost({
        text: this.state.text.trim(),
        localUri: this.state.image,
      })
      .then((ref) => {
        this.setState({ text: "", image: null });
        this.props.navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
    this.setState({ image: Fire.shared.remoteUri() });
    this.submitToGoogle;
  };

  takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!pickerResult.cancelled) {
      this.setState({ image: pickerResult.uri });
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="md-arrow-back" size={24} color="#D8D9D8"></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handlePost}>
            <Text style={{ fontWeight: "500" }}>Posts</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            autoFocus={true}
            multiline={true}
            numberOfLines={4}
            style={{ flex: 1 }}
            placeholder="Want to add something to your list?"
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
          ></TextInput>
        </View>

        <TouchableOpacity style={styles.photo} onPress={this.takePhoto}>
          <Ionicons name="md-camera" size={32} color="#D8D9D8"></Ionicons>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.submitToGoogle}>
          <Text style={{ fontWeight: "500" }}>Analyse</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#D8D9DB",
  },
  inputContainer: {
    margin: 32,
    flexDirection: "row",
  },
  photo: {
    alignItems: "flex-end",
    marginHorizontal: 32,
  },
});
