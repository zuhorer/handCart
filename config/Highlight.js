import React, { Component } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
//import FadeIn from '@expo/react-native-fade-in-image';
//import layout from './layout';
var list = [];
import Fire from "../fire/fire";
const Firebase = require("firebase");
import { Ionicons } from "@expo/vector-icons";
require("firebase/firestore");
export default class ListItem extends Component {
  state = {
    text: "",
    Finallist: [],
  };
  handlePost = (name) => {
    list.push(name);
    this.setState({ text: null });
  };

  Displaylist = () => {
    return (
      <View>
        <ScrollView>
          {list.map((item, index) => (
            <Text key={index}>{item}</Text>
          ))}
        </ScrollView>
      </View>
    );
  };
  UpdateFireList = () => {
    Fire.shared
      .addCurrentCustomerList({
        text: list,
      })
      .then((ref) => {
        this.setState({ text: null });
        list = [];
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };
  render() {
    let { name } = this.props.item;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <TouchableOpacity>
            <Ionicons name="md-add" size={24} color="#FFFFFF"></Ionicons>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "transparent",
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgb(200, 199, 204)",
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 22,
    fontFamily: "Avenir",
    color: "#FFFFFF",
  },

  avatarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderColor: "gray",
    borderWidth: 1,
  },
});
