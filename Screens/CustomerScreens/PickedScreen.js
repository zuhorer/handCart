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
import Fire from "../../fire/fire";
import { Ionicons } from "react-native-vector-icons";

export default class ManageOrders extends React.Component {
  state = {
    loading: false,
    users: [],
    refreshing: false,
  };
  async componentDidMount() {
    this.makeRemoteRequest();
  }
  makeRemoteRequest = async () => {
    this.setState({ loading: true });
    await Fire.shared.CustomerPickedLists().then((ref) => {
      this.setState({
        users: ref,
        loading: false,
      });
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
