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
import { SearchBar } from "react-native-elements";
import _ from "lodash";

import * as firebase from "firebase";
import { SafeAreaView, NavigationEvents } from "react-navigation";
import Fire from "../../fire/fire";

export default class Test extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    Finallist: null,
    FullFinallist: null,
    quantity: 0,
    query: "",
    searchedStatus: "searching",
  };
  async componentDidMount() {
    this.listUpdate();
  }

  search = ({ name }, query) => {
    if (name.includes(query)) {
      return true;
    }
    return false;
  };

  handleSearch = (text) => {
    const query = text.toLowerCase();
    const Finallist = _.filter(this.state.FullFinallist, (item) => {
      return this.search(item, query);
    });
    //alert(JSON.stringify(Finallist));
    this.setState({ query: text, Finallist });
  };
  listUpdate = async () => {
    this.setState({ query: "" });
    var Finallist = await Fire.shared.FetchingItemsFromInventory();

    this.setState({
      Finallist: Finallist,
      FullFinallist: Finallist,
    });
  };
  renderSeperator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%",
        }}
      />
    );
  };
  renderHeader = () => {
    return (
      <SearchBar
        placeholder="search LIST name here..."
        lightTheme
        round
        onChangeText={this.handleSearch}
        value={this.state.query}
      />
    );
  };
  renderFooter = () => {
    if (!this.state.loading) return null;
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderTopColor: "CED0CE",
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };
  searchingMaininventory = async () => {
    const query = this.state.query;
    const response = await Fire.shared.searchingInMainInventory({
      name: query.toLowerCase(),
    });
    //alert(JSON.stringify(response.status));
    //this.setState({ searchedStatus: response.status });
    if (response) {
      Fire.shared.AddingVendorInventory({
        id: response.ID,
        NAME: response.name,
      });
      this.props.navigation.navigate("newItem", { status: response.status });
    } else {
      this.props.navigation.navigate("newItem", { status: "NotFound" });
    }
  };

  NoResults = () => {
    if (this.state.query === "") {
      return (
        <View>
          <Text>HI</Text>
        </View>
      );
    }
    return (
      <View>
        <Button
          onPress={() => this.searchingMaininventory()}
          title="NO results? Click Here"
        />
      </View>
    );
  };

  render() {
    //const { navigation } = this.props;
    //const userData = navigation.getParam("Order", null);
    // const userID = navigation.getParam("listId", null);
    //alert(JSON.stringify(userID));

    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents onDidFocus={() => this.listUpdate()} />
        <View>
          <FlatList
            data={this.state.Finallist}
            renderItem={({ item }) => (
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 32,
                  paddingVertical: 12,
                  // borderBottomWidth: 1,
                }}
              >
                <Text>{`ITEM ${item.name}`}</Text>

                <TouchableOpacity>
                  <Ionicons
                    name="md-arrow-forward"
                    size={24}
                    color="#D8D9D8"
                  ></Ionicons>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.key}
            ItemSeparatorComponent={this.renderSeperator}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
          />
        </View>
        {this.NoResults()}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
