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
import { Constants } from "expo";
import * as Permissions from "expo-permissions";
import { Ionicons, Octicons, FontAwesome5 } from "@expo/vector-icons";
import "react-native-get-random-values";

import * as firebase from "firebase";
import { SafeAreaView } from "react-navigation";

export default class Test extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    Finallist: [],
    quantity: 0,
  };

  render() {
    const { navigation } = this.props;
    const userData = navigation.getParam("Order", null);
    // const userID = navigation.getParam("listId", null);
    //alert(JSON.stringify(userID));
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <FlatList
            data={userData}
            renderItem={this.QuantityManage}
            keyExtractor={(item) => item.ID}
          />
        </View>
        <Button
          title="Order packed"
          // onpress={()=>this.}
        />
      </SafeAreaView>
    );
  }

  QuantityManage({ item }) {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity>
          <Text>{JSON.stringify(item.name)}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
