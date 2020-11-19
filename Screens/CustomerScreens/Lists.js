import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import PropTypes from "prop-types";
//import layout from "./layout";
import algoliasearch from "algoliasearch";
import {
  InstantSearch,
  RefinementList,
  connectSearchBox,
  connectInfiniteHits,
} from "react-instantsearch-dom";
import { Ionicons } from "@expo/vector-icons";
import ListItem from "../../config/Highlight";
import { Constants } from "expo-constants";
var list = [];
import Fire from "../../fire/fire";
const Firebase = require("firebase");
require("firebase/firestore");
import { SafeAreaView } from "react-navigation";

const searchcli = algoliasearch(
  "ZSZQ3RISGJ",
  "8212eb241af19dffad3144135f69cef8"
);
export default class UsersList extends React.Component {
  render() {
    return (
      <View style={styles.mainContainer}>
        <InstantSearch searchClient={searchcli} indexName="General Inventory">
          <View>
            <ConnectedSearchBar />
          </View>
          <ConnectedHits />
        </InstantSearch>

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("MAP")}
          >
            <Text style={{ fontWeight: "500" }}>Let's Find some vendors.</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
class SearchBar extends React.Component {
  state = {
    text: "",
    Finallist: [],
    image: null,
  };
  handlePost = () => {
    list.push(this.state.text.trim());
    this.setState({ text: null });
  };
  _onChangeText = ({ text }) => {
    this.setState({ text });
    this.props.refine(text);
  };
  _value = () => {
    this.props.refine(text);
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
    return (
      <View>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="md-arrow-back" size={24} color="#D8D9D8"></Ionicons>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={this.handlePost}>
          <Text style={{ fontWeight: "500" }}>Add Item To List</Text>
        </TouchableOpacity>

        <TextInput
          returnKeyType="done"
          clearButtonMode="while-editing"
          onFocus={this._onFocus}
          onBlur={this._onBlur}
          //style={styles.textInput}
          placeholder="Want to add something to your list?"
          onChangeText={(text) => this._onChangeText(text)}
          value={this.props.currentRefinement}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          autoFocus
        />
      </View>
    );
  }
  focus() {
    this._textInput && this._textInput.focus();
  }

  blur() {
    this._textInput && this._textInput.blur();
  }

  _onFocus = () => {
    this.setState({ isFocused: true });
    this.props.onFocus && this.props.onFocus();
  };

  _onBlur = () => {
    this.setState({ isFocused: false });
    this.props.onBlur && this.props.onBlur();
  };
}
SearchBar.propTypes = {
  refine: PropTypes.func,
  currentRefinement: PropTypes.string,
};

const ConnectedSearchBar = connectSearchBox(SearchBar);

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
    return <ListItem item={item} />;
  }
}

Hits.propTypes = {
  hits: PropTypes.array,
  refine: PropTypes.func,
  hasMore: PropTypes.bool,
};

const ConnectedHits = connectInfiniteHits(Hits);
/*
<TouchableOpacity onPress={this.UpdateFireList}>
          <Text style={{ fontWeight: "500", paddingVertical: 12 }}>
            Submit List?
          </Text>
        </TouchableOpacity>
        <View>
          <Text>Your List is:</Text>
          {this.Displaylist()}
        </View>

/*
<ConnectedHits />
<ConnectedSearchBar />

*/
/*


*/
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
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
  searchContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgb(200, 199, 204)",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  logo: {
    height: 20,
    width: 20,
  },
  textInput: {
    height: 30,
    fontSize: 24,
  },
});
