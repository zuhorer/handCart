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
  TextInput,
  ScrollView,
  View,
} from "react-native";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import ListItem from "../../config/Highlight";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import PropTypes from "prop-types";
import Environment from "../../config/environment";
import * as firebase from "firebase";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  connectSearchBox,
  connectInfiniteHits,
  connectHits,
} from "react-instantsearch-dom";
import Fire from "../../fire/fire";
import { SafeAreaView, NavigationEvents } from "react-navigation";
import { SharedElement } from "react-navigation-shared-element";
import { LongPressGestureHandler } from "react-native-gesture-handler";
import { color } from "react-native-reanimated";
//import { SwipeHiddenHeader } from "react-native-swipe-hidden-header";
import Data from "./../../config/CustomerHomeIcons";
//import { TextInput } from "react-native-gesture-handler";
const iconsize = 50;
const Firebase = require("firebase");
require("firebase/firestore");
var list = [];
var listId = [];
const searchcli = algoliasearch(
  "ZSZQ3RISGJ",
  "8212eb241af19dffad3144135f69cef8"
);

class CustomerListScreen extends React.Component {
  state = {
    status: "",
    userData: null,
    userID: null,
    timestamp: null,
  };
  async componentDidMount() {
    // alert("Hi");
    //this.setState({ status: "" });

    //alert(this.state.timestamp);
    this.checkUserData();
  }
  checkUserData = async () => {
    const { navigation } = this.props;
    const userData = await navigation.getParam("list", null);
    const userID = await navigation.getParam("listId", null);
    const status = await navigation.getParam("status", null);
    const timestamp = await navigation.getParam("timeStamp", null);
    this.setState({ timestamp, userData, userID, status: "Nein" });
    // alert(JSON.stringify(this.state.timestamp));
    //alert(timestamp);
    //alert(userID);
    if (this.state.userData !== null) {
      // alert("Hi");
      list = this.state.userData;
      listId = this.state.userID;
      this.setState({ status: "Update" });

      // alert(JSON.stringify(this.state.status));
    } else {
      list = [];
      listId = [];
      this.setState({ status: "" });

      //alert(this.state.status);
    }
  };
  ongo = () => {
    //alert(this.state.timestamp);
    this.props.navigation.navigate("ListFinal", {
      list: list,
      listId: listId,
      status: this.state.status,
      timeStamp: this.state.timestamp,
    });
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents onDidFocus={() => this.checkUserData()} />

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 20,

            borderTopWidth: 1,
            borderTopColor: "#BABF9E",
            borderBottomWidth: 1,
            borderBottomColor: "#BABF9E",
          }}
        >
          <View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Ionicons
                name="ios-arrow-back"
                size={24}
                color="#E9446A"
                style={{
                  flexWrap: "wrap",
                  paddingHorizontal: 15,
                  paddingVertical: 1,
                }}
              />
            </TouchableOpacity>
          </View>
          {Data.map((item) => {
            return (
              <TouchableOpacity key={item.title} onPress={() => {}}>
                <SharedElement id={`item.${item.title}.icon`}>
                  <View>
                    <View style={styles.imageContainer}>
                      <Image style={styles.image} source={item.image} />
                    </View>
                  </View>
                </SharedElement>
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={{
            width: "100%",
            flexDirection: "column",
            paddingVertical: 10,
          }}
        >
          <View>
            <Image
              style={{ width: 1, height: 2 }}
              source={require("../../assets/logo-algolia-white-full.png")}
            ></Image>
          </View>

          <InstantSearch searchClient={searchcli} indexName="General Inventory">
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 10,
                justifyContent: "space-between",
                color: "#E9446A",
              }}
            >
              <AntDesign
                name="search1"
                size={24}
                color="#E9446A"
                style={{ paddingHorizontal: 20, paddingVertical: 25 }}
              ></AntDesign>
              <ConnectedSearchBox />
              <TouchableOpacity onPress={() => this.ongo()}>
                <Ionicons
                  name="md-send"
                  size={24}
                  color="#E9446A"
                  style={{ paddingHorizontal: 15, paddingVertical: 25 }}
                ></Ionicons>
              </TouchableOpacity>
            </View>
            <View style={{ paddingVertical: 20, backgroundColor: "#800080" }}>
              <ConnectedHits />
            </View>
          </InstantSearch>
        </View>
      </SafeAreaView>
    );
  }
}
class SearchBox extends React.Component {
  render() {
    return (
      <TextInput
        style={{
          height: 60,
          width: 230,
          paddingVertical: 10,
          paddingHorizontal: 0,
          borderBottomWidth: 1,
          borderColor: "#E9446A",
        }}
        onChangeText={(text) => this.props.refine(text)}
        value={this.props.currentRefinement}
        placeholder={"Search a product..."}
        clearButtonMode={"always"}
        spellCheck={false}
        autoCorrect={false}
        autoCapitalize={"none"}
      ></TextInput>
    );
  }
}

SearchBox.propTypes = {
  refine: PropTypes.func,
  currentRefinement: PropTypes.string,
};

const ConnectedSearchBox = connectSearchBox(SearchBox);

const pressHandler = (objectID, unit, name) => {
  // alert(JSON.stringify(unit));
  if (listId.every((item) => item !== objectID)) {
    const product = {
      name: name,
      objectID: objectID,
      unit: unit,
    };
    //product.push(

    //);
    list.push(product);
    listId.push(objectID);
  } else {
    alert("Already Added");
  }
};

class Hits extends React.Component {
  render() {
    const hits =
      this.props.hits.length > 0 ? (
        <FlatList
          data={this.props.hits}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.objectID}
          initialNumToRender={20}
        />
      ) : null;
    return hits;
  }

  renderItem({ item }) {
    //alert(JSON.stringify(item));
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => pressHandler(item.objectID, item.unit, item.name)}
          style={{ paddingHorizontal: 30 }}
        >
          <Ionicons name="md-add" size={24} color="#FFFFFF"></Ionicons>
        </TouchableOpacity>
      </View>
    );
  }
}

Hits.propTypes = {
  hits: PropTypes.array,
  refine: PropTypes.func,
  hasMore: PropTypes.bool,
};

const ConnectedHits = connectInfiniteHits(Hits);
CustomerListScreen.sharedElements = (navigation, otherNavigation, showing) => {
  //const item = navigation.getParam('item');
  return Data.map((item) => `item.${item.title}.icon`);
};

export default CustomerListScreen;

/*
Hit = (props) => {
  return <Highlight attribute="name" hit={props.hit} />;
};

Hit.propTypes = {
  hit: PropTypes.object,
};

/*Fire.shared
      .addPost({
        text: list,
      })
      .then((ref) => {
        this.setState({ text: null });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
<View>
          
       /*Fire.shared
      .addPost({
        text: list,
      })
      .then((ref) => {
        this.setState({ text: null });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });   
        </View>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    flexDirection: "column",
  },
  imageContainer: {
    width: iconsize,
    height: iconsize,
    borderRadius: iconsize / 2,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: iconsize * 0.6,
    height: iconsize * 0.6,
    resizeMode: "contain",
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
  textinput: {
    width: "70%",

    flexDirection: "column",
    paddingVertical: 12,
  },
  inputContainer: {
    margin: 32,
    flexDirection: "row",
    justifyContent: "space-around",
    elevation: 5,
  },
  photo: {
    alignItems: "flex-end",
    marginHorizontal: 32,
  },
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
    paddingHorizontal: 30,
    //fontFamily: "Aven,
    color: "#FFFFFF",
  },
});
