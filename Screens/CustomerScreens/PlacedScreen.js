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
import { ListItem, SearchBar } from "react-native-elements";
import { List } from "native-base";
import { ImagePicker, Permissions } from "expo";
import Environment from "../../config/environment";
import * as firebase from "firebase";
import Fire from "../../fire/fire";
import { Ionicons } from "react-native-vector-icons";
import { times } from "lodash";
//import { Icon } from "react-native-paper/lib/typescript/src/components/Avatar/Avatar";

export default class ManageOrders extends React.Component {
  state = {
    loading: false,
    users: [],
    refreshing: false,
  };
  async componentDidMount() {
    // this.setState({ loading: true});
    this.makeRemoteRequest();
    //await Fire.shared.UpdatingVendorOrderList().then((ref) => {
    //this.setState({ users: ref, loading: false });
    //});
  }
  makeRemoteRequest = async () => {
    this.setState({ loading: true });
    //alert(JSON.stringify(this.state.users));
    await Fire.shared.CustomerPlacedLists().then((ref) => {
      // alert(JSON.stringify(ref));
      //
      this.setState({
        users: ref,
        loading: false,
      });
    });
  };

  //Users = () => {
  // Initial empty array of users
  //alert(this.setState.users);
  /*useEffect(() => {
      const users = Fire.shared.UpdatingVendorOrderList();
      
      //
      //setLoading(false);
      // Unsubscribe from events when no longer in use
      // return () => subscriber();
    });*/
  //};
  //<Text>User Name: {item.}</Text>

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
      <SearchBar placeholder="search LIST name here..." lightTheme round />
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
  render() {
    //const [loading, users] = this.state; // Set loading to true on component mount
    //const [, setUsers] = this.state;
    // if (this.state.loading === true) {
    // return <ActivityIndicator />;
    //}
    if (this.state.loading === false) {
      return (
        <View>
          <View>
            <FlatList
              data={this.state.users}
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
                  <Text>{`User ID: ${item.key}`}</Text>

                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("ListFinal", {
                        list: item.currentlist,
                        status: item.status,
                        listId: item.ProductIds,
                        timeStamp: item.timestamp,
                      })
                    }
                  >
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
        </View>
      );
    }
    return <ActivityIndicator />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  footer: {
    backgroundColor: "#E9446A",
    alignItems: "center",
    justifyContent: "center",
  },
});
