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
//import NumericInput from "react-native-numeric-input";
import InputSpinner from "react-native-input-spinner";
import * as firebase from "firebase";
import { SafeAreaView } from "react-navigation";
import Fire from "../../fire/fire";

export default class Test extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    units: null,
    userData: null,
    userID: null,
    status: "",
    timeStamp: null,
  };
  async componentDidMount() {
    //alert("Hi");
    const { navigation } = this.props;
    const userData = await navigation.getParam("list", null);
    const userID = await navigation.getParam("listId", null);
    const status = await navigation.getParam("status", null);
    const timeStamp = await navigation.getParam("timeStamp", null);
    await this.setState({ status, userData, userID, timeStamp });

    alert(JSON.stringify(userData[0].unit[0]));
  }
  save = async () => {
    //
    //alert(JSON.stringify(this.state.userData)s);
    //alert(this.state.userData);
    if (this.state.status === "Update") {
      Fire.shared
        .updatingDrafts({
          text: this.state.userData,
          productIds: this.state.userID,
          timestamp: this.state.timeStamp,
        })
        .then((ref) => {
          //alert(JSON.stringify(ref));
          this.setState({ status: "Saved", timeStamp: ref });
          alert("Saved");
          // alert(this.state.status);
        })

        .catch((error) => {
          console.log(error);
          alert(error);
        });
    } else {
      //alert(JSON.stringify(this.state.userData));
      Fire.shared
        .addCurrentCustomerList({
          text: this.state.userData,
          productIds: this.state.userID,
        })
        .then((ref) => {
          this.setState({ status: "Saved", timeStamp: ref });
          //salert(ref);
        })

        .catch((error) => {
          console.log(error);
          alert(error);
        });
    }
  };
  Confirmation = () => {
    if (this.state.status === "Saved") {
      return (
        <View>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("List", {
                list: this.state.userData,
                listId: this.state.userID,
                status: this.state.status,
                timeStamp: this.state.timeStamp,
              })
            }
            style={{ alignItems: "center", paddingVertical: 30 }}
          >
            <Text style={{ color: "#E9446A", fontSize: 22 }}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("MAP", {
                list: this.state.userID,
                status: this.state.status,
              })
            }
            style={{ alignItems: "center", paddingVertical: 30 }}
          >
            <Text style={{ color: "#E9446A", fontSize: 22 }}>Search</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (this.state.status === "Placed") {
      return (
        <View>
          <TouchableOpacity
            style={{ alignItems: "center", paddingVertical: 30 }}
          >
            <Text style={{ color: "#E9446A", fontSize: 22 }}>
              Vendor Notified
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (this.state.status === "Update") {
      return (
        <View>
          <TouchableOpacity
            onPress={() => this.save()}
            style={{ alignItems: "center", paddingVertical: 30 }}
          >
            <Text style={{ color: "#E9446A", fontSize: 22 }}>SAVE</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (this.state.status === "Ready") {
      return (
        <View>
          <TouchableOpacity
            style={{ alignItems: "center", paddingVertical: 30 }}
          >
            <Text style={{ color: "#E9446A", fontSize: 22 }}>
              Please Collect
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (this.state.status === "Picked") {
      return (
        <View>
          <TouchableOpacity
            style={{ alignItems: "center", paddingVertical: 30 }}
          >
            <Text style={{ color: "#E9446A", fontSize: 22 }}>
              Transaction Completed
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (this.state.status === "") {
      return (
        <View>
          <TouchableOpacity
            onPress={() => this.save()}
            style={{ alignItems: "center", paddingVertical: 30 }}
          >
            <Text style={{ color: "#E9446A", fontSize: 22 }}>SAVE</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <View>
            <FlatList
              data={this.state.userData}
              renderItem={this.QuantityManage}
              keyExtractor={(item) => item.objectID}
            />
          </View>
          {this.Confirmation()}
        </View>
      </SafeAreaView>
    );
  }

  QuantityManage({ item }) {
    //alert(item);
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",

          paddingHorizontal: 32,
          paddingVertical: 12,
        }}
      >
        <View>
          <TouchableOpacity>
            <Text
              style={{ color: "#E9446A", fontSize: 18 }}
            >{`${item.name} (${item.unit[0]})`}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TextInput
            placeholder="Enter units"
            numeric // This prop makes the input to get numeric only
            keyboardType={"numeric"}
            style={{ borderBottomWidth: 1 }}
            onChangeText={(text) => {
              item.unitvalue = text;
            }}
            value={item.unitvalue}
          />
        </View>

        <View style={{ paddingStart: 20 }}>
          <InputSpinner
            max={10}
            min={0}
            step={1}
            style={{ paddingHorizontal: 5 }}
            colorMax={"#E9446A"}
            colorMin={"#E9446A"}
            value={item.quantity}
            onChange={(value) => {
              item.quantity = value;
              //alert(item.quantity);
            }}
          />
        </View>
      </View>
    );
  }
  addwight = (text) => {
    this.setState({ units: text });
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
/*
<NumericInput
          type="up-down"
          value={this.state.unit}
          onChange={(value) => this.setState({ unit: value })}
          step={10}
        />*/
