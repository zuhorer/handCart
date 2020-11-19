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
  Alert,
} from "react-native";
import { Constants } from "expo";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import Environment from "../../config/environment";
import * as firebase from "firebase";
import { SafeAreaView } from "react-navigation";
import Fire from "../../fire/fire";

export default class CustomerConfirmation extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    status: "",
  };
  QuantityManage({ item }) {
    return (
      <View>
        <Text>{item.name}</Text>
      </View>
    );
  }
  onSend = async (UID, VendorInvn, ProductIds) => {
    this.SendtoVendor(UID, VendorInvn, ProductIds);
  };
  SendtoVendor = async (UID, vendorInvn, ProductIds) => {
    //ale rt(JSON.stringify(vendorInvn));
    await Fire.shared.sendingItemToVendor({
      VendorUID: UID,
      itemList: vendorInvn,
      ProductIds: ProductIds,
      status: "Placed",
    });
    this.setState({ status: "Placed" });
    //alert(this.state.status);
  };
  /*SendtoCustomer = (UID, vendorInvn, ProductIds) => {
    Fire.shared
      .updatingToSaved({
        VendorUID: UID,
        itemList: vendorInvn,
        ProductIds: ProductIds,
        status: "Placed",
      })
      .then((ref) => {
       
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };*/

  render() {
    const { navigation } = this.props;
    const VendorData = navigation.getParam("availableItems", null);

    //const userID = navigation.getParam("listId", null);
    if (this.state.status !== "Placed") {
      return (
        <SafeAreaView style={styles.container}>
          <View>
            <FlatList
              data={VendorData.vendorInvn}
              renderItem={this.QuantityManage}
              keyExtractor={(item) => item.ID}
            />
          </View>
          <View>
            <Text>{VendorData.UID}</Text>
          </View>
          <Button
            title="Confirm Order"
            onPress={() =>
              this.SendtoVendor(
                VendorData.UID,
                VendorData.vendorInvn,
                VendorData.ProductIds
              )
            }
          />
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <FlatList
            data={VendorData.vendorInvn}
            renderItem={this.QuantityManage}
            keyExtractor={(item) => item.ID}
          />
        </View>
        <View>
          <Text>{VendorData.UID}</Text>
        </View>
        <Button
          title="Placed"
          onPress={() => this.props.navigation.navigate("Home")}
        />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
//
