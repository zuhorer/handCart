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
  Alert,
} from "react-native";
import { Constants } from "expo";
import * as Permissions from "expo-permissions";
import Icon, {
  Ionicons,
  Octicons,
  FontAwesome5,
} from "@expo/vector-icons/Feather";
import "react-native-get-random-values";
import DropDownPicker from "react-native-dropdown-picker";
import Fire from "../../fire/fire";
import * as firebase from "firebase";
import { SafeAreaView } from "react-navigation";
const Item = [];
export default class Test extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    Finallist: [],
    quantity: 0,
    status: "",
    units: "Gms",
    name: "",
    ItemStatus: "unit",
    value: null,
    cost: null,
    unit: null,
    quantity: null,
  };
  async componentDidMount() {
    const { navigation } = this.props;
    const status = navigation.getParam("status", null);
    this.setState({ status });
  }
  saveItem = () => {
    Item.push({
      value: this.state.value,
      cost: this.state.cost,
      quantity: this.state.quantity,
    });
    this.setState({ value: null, cost: null, quantity: null });
    //alert(JSON.stringify(Item));
  };

  update = async () => {
    //alert(JSON.stringify(Item));

    await Fire.shared.AddingtoInventory({ item: Item }).then((ref) => {});
    this.props.navigation.navigate("Inventory");
  };

  saveName = () => {
    Item.push({
      name: this.state.name,
    });
    Item.push({
      unit: this.state.unit,
    });
    this.setState({
      ItemStatus: "ADD",
    });
  };
  Finalise = () => {
    if (Item.length < 3) {
      return (
        <View>
          <Button onPress={() => this.saveItem()} title="ADD UNIT" />
        </View>
      );
    }
    if (Item.length >= 3) {
      return (
        <View>
          <View>
            <Button onPress={() => this.saveItem()} title="ADD ANOTHER UNIT" />
          </View>
          <View>
            <Button
              onPress={() =>
                Alert.alert("List Updating", "Press OK to update Your list", [
                  { text: "OK", onPress: () => this.update() },
                  { text: "ADD MORE UNITS" },
                ])
              }
              title="FINALISE"
            />
          </View>
        </View>
      );
    }
  };
  save = () => {
    if (this.state.ItemStatus === "ADD") {
      return (
        <View>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 32,
              paddingVertical: 12,
            }}
          >
            <Text>ADD UNIT value(100/50 or other):</Text>
            <TextInput
              placeholder="ADD unit"
              numeric // This prop makes the input to get numeric only
              keyboardType={"numeric"}
              style={{ borderBottomWidth: 1 }}
              onChangeText={(text) => this.setState({ value: text })}
              value={this.state.value}
            />
          </View>

          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 32,
              paddingVertical: 12,
            }}
          >
            <Text>ADD UNIT cost:</Text>
            <TextInput
              placeholder="Enter cost"
              numeric // This prop makes the input to get numeric only
              keyboardType={"numeric"}
              style={{ borderBottomWidth: 1 }}
              onChangeText={(text) => this.setState({ cost: text })}
              value={this.state.cost}
            />
          </View>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 32,
              paddingVertical: 12,
            }}
          >
            <Text>ADD Quantity available:</Text>
            <TextInput
              placeholder="How many?"
              numeric // This prop makes the input to get numeric only
              keyboardType={"numeric"}
              style={{ borderBottomWidth: 1 }}
              onChangeText={(text) => this.setState({ quantity: text })}
              value={this.state.quantity}
            />
          </View>
          {this.Finalise()}
        </View>
      );
    }
    if (this.state.name && this.state.unit !== null) {
      return (
        <View>
          <Button
            onPress={() => this.saveName()}
            title="Click to add details"
          />
        </View>
      );
    }
  };

  render() {
    //const { navigation } = this.props;
    //const userData = navigation.getParam("Order", null);
    // const userID = navigation.getParam("listId", null);
    //alert(JSON.stringify(userID));
    if (this.state.status === "Found") {
      alert("Submited");
      return (
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Inventory")}
          >
            <Text>Click to go back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={{
            alignItems: "center",
            paddingHorizontal: 32,
            paddingVertical: 12,
          }}
        >
          <Text>ADD NEW ITEM HERE</Text>
        </TouchableOpacity>

        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 32,
            paddingVertical: 12,
          }}
        >
          <Text style={{ paddingVertical: 12 }}>ENTER NAME</Text>
          <TextInput
            placeholder="Enter NAME OF product"
            style={{ borderBottomWidth: 1 }}
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ name: text })}
            value={this.state.name}
          />
        </View>

        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 32,
            paddingVertical: 12,
          }}
        >
          <Text>CLICK TO ADD UNITS:</Text>
          <DropDownPicker
            items={[
              {
                label: "Gms",
                value: "Gms",
                icon: () => <Icon name="flag" size={18} color="#900" />,
              },
              {
                label: "Ml",
                value: "Ml",
                icon: () => <Icon name="flag" size={18} color="#900" />,
              },
            ]}
            multiple={true}
            multipleText="%d items have been selected."
            min={0}
            max={1}
            defaultValue={this.state.units}
            containerStyle={{ height: 40, width: 200 }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(item) =>
              this.setState({
                unit: item, // an array of the selected items
              })
            }
          />
        </View>

        {this.save()}
      </SafeAreaView>
    );
  }
}
//{this.add()}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
/*<DropDownPicker
            items={[
              {
                label: "Gms",
                value: "Gms",
                icon: () => <Icon name="flag" size={18} color="#900" />,
              },
              {
                label: "ML",
                value: "ML",
                icon: () => <Icon name="flag" size={18} color="#900" />,
              },
            ]}
            multiple={true}
            multipleText="%d items have been selected."
            min={0}
            max={10}
            defaultValue={this.state.units}
            containerStyle={{
              paddingHorizontal: 32,
              paddingVertical: 12,
            }}
            style={{
              backgroundColor: "#fafafa",
              paddingHorizontal: 32,
              paddingVertical: 20,
            }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{
              backgroundColor: "#fafafa",
              paddingHorizontal: 32,
              paddingVertical: 12,
            }}
            onChangeItem={(item) =>
              this.setState({
                units: item, // an array of the selected items
              })
            }
          />
*/
